import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { deleteIcon, editIcon } from "../../../assets";
import { ROUTES } from "../../../Routes";
import stores from "../../../stores";
import Button from "../../components/Button/button";
import DataTable from "../../components/DataTable/dataTable";
import AddSource from "../../components/Sources/addSource";
import "../Users/users.css";

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
              if (window.confirm("Are you sure?"))
                sourceStore.delete(row._original._id);
            }}
          />
          <img
            src={editIcon}
            alt="edit"
            onClick={() => {
              toggleModal();
              sourceStore.setSelected(row._original);
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
  const { create, update } = sourceStore;
  try {
    const source = {
      source: values,
      users: values.users
        .filter((user) => user.isActive)
        .map((user) => user._id),
    };
    if (source._id) await update(source);
    else await create(source);
    toggleModal();
  } catch (err) {
    alert(err);
  }
};

const Sources = () => {
  useEffect(() => {
    sourceStore.fetchAll();
    userStore.fetchAll();
  }, []);

  const { getUser, list: allUsers } = userStore;
  const { list, isModalshown, setSelected, selected } = sourceStore;
  if (!getUser.admin) return <Redirect to={ROUTES.HOME} />;
  return (
    <div className="users-container">
      <h1>Sources Management</h1>
      <Button
        className="add-user"
        onClick={() => {
          toggleModal();
          setSelected({});
        }}
      >
        Add Source
      </Button>
      <DataTable columns={sourceColumns(true)} data={toJS(list)} />
      <AddSource
        show={isModalshown}
        onClose={toggleModal}
        initialValues={toJS({ ...selected, users: [...allUsers] })}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default observer(Sources);
