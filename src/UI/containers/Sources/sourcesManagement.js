import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { deleteIcon, editIcon } from "../../../assets";
import stores from "../../../stores";
import Button from "../../components/Button/button";
import DataTable from "../../components/DataTable/dataTable";
import AddSource from "../../components/Sources/addSource";
import "../Users/management.css";

export const sourceColumns = (actions) => {
  const columns = [
    {
      Header: "name",
      accessor: "name",
      width: 200,
    },
    {
      Header: "uri",
      accessor: "uri",
      width: 450,
    },
  ];
  if (actions) {
    columns.push({
      Header: "",
      Cell: ({ row }) => (
        <div className="actions">
          <img
            src={deleteIcon}
            alt="delete"
            onClick={() => {
              if (window.confirm("Are you sure?")) {
                sourceStore
                  .delete(row._original._id)
                  .then(() => toast.success("Source successfully deleted"))
                  .catch((err) => toast.error(err.message));
              }
            }}
          />
          <img
            src={editIcon}
            alt="edit"
            onClick={() => {
              sourceStore.setSelected(row._original);
              toggleModal();
            }}
          />
        </div>
      ),
      sortable: false,
      filterable: false,
      resizable: false,
      width: 150,
    });
  }
  return columns;
};

const { userStore, sourceStore } = stores;

const toggleModal = () => {
  const { isModalshown, setIsModalShown } = sourceStore;
  setIsModalShown(!isModalshown);
};

const onSubmit = async (values) => {
  try {
    const { create, update, addSourceToUsers } = sourceStore;
    let message;
    if (values._id) {
      message = "Source successfully updated";
      await update(values);
    } else {
      message = "Source successfully created";
      const users = values.users
        .filter((user) => user.isActive)
        .map((user) => user._id);
      const newSource = await create(values);
      await addSourceToUsers(newSource, users);
    }
    toggleModal();
    toast.success(message);
  } catch (err) {
    toast.error(err.message);
  }
};

const SourcesManagement = () => {
  useEffect(() => {
    sourceStore.fetchAll();
    userStore.fetchAll();
  }, []);

  const allUsers = userStore.list;
  const { list, isModalshown, setSelected, selected } = sourceStore;

  return (
    <div className="users-container">
      <h1>Sources Management</h1>
      <Button
        className="add-source"
        onClick={() => {
          toggleModal();
          setSelected({ name: "", uri: "", users: allUsers });
        }}
      >
        Add Source
      </Button>
      <DataTable columns={sourceColumns(true)} data={toJS(list)} />
      <AddSource
        show={isModalshown}
        onClose={toggleModal}
        initialValues={toJS(selected)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default observer(SourcesManagement);
