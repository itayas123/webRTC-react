import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { deleteIcon, editIcon } from "../../../assets";
import stores from "../../../stores";
import Button from "../../components/Button/button";
import DataTable from "../../components/DataTable/dataTable";
import AddUser from "../../components/Users/addUser";
import { sourceColumns } from "../Sources/sourcesManagement";
import "./management.css";

const columns = [
  {
    Header: "email",
    accessor: "email",
    width: 200,
  },
  {
    Header: "name",
    accessor: "name",
    width: 200,
  },
  {
    Header: "admin",
    accessor: "admin",
    Cell: ({ row, value }) => <span>{value ? "Yes" : "No"}</span>,
    width: 200,
    filterMethod: (filter, row) => {
      const value = row.admin ? "Yes" : "No";
      return value.toLowerCase().includes(filter.value.toLowerCase());
    },
  },
  {
    Header: "password",
    accessor: "password",
    Cell: ({ row, value }) => (
      <span>
        {value
          .toString()
          .split("")
          .map((char) => "*")}
      </span>
    ),
    width: 200,
    filterable: false,
  },
  {
    Header: "",
    Cell: ({ row }) => (
      <div className="actions">
        <img
          src={deleteIcon}
          alt="delete"
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              userStore
                .delete(row._original._id)
                .then(() => toast.success("User successfully deleted"))
                .catch((err) => toast.error(err.message));
            }
          }}
        />
        <img
          src={editIcon}
          alt="edit"
          onClick={() => {
            userStore.setSelected(row._original);
            toggleModal();
          }}
        />
      </div>
    ),
    sortable: false,
    filterable: false,
    resizable: false,
    width: 150,
  },
];

const { userStore, sourceStore } = stores;

const toggleModal = () => {
  const { isModalshown, setIsModalShown } = userStore;
  setIsModalShown(!isModalshown);
};

const onSubmit = async (values) => {
  const { update, create } = userStore;
  try {
    const user = {
      ...values,
      sources: values.sources
        .filter((source) => source.isActive)
        .map((source) => source._id),
    };
    let message;
    if (user._id) {
      message = "User successfully updated";
      await update(user);
    } else {
      message = "User successfully created";
      await create(user);
    }
    toggleModal();
    toast.success(message);
  } catch (err) {
    toast.error(err.message);
  }
};

const UsersManagement = () => {
  useEffect(() => {
    userStore.fetchAll();
    sourceStore.fetchAll();
  }, []);

  const { list, isModalshown, selected, setSelected } = userStore;

  return (
    <div className="users-container">
      <h1>Users Management</h1>
      <Button
        className="add-user"
        onClick={() => {
          toggleModal();
          setSelected({ email: "", password: "", name: "", sources: [] });
        }}
      >
        Add User
      </Button>
      <DataTable
        columns={columns}
        data={toJS(list)}
        SubComponent={(row) => {
          const { sources, name } = row.original;
          return (
            <div className="user-sources-tabel">
              <h3>{`${name} allowed sources`}</h3>
              <DataTable data={sources} columns={sourceColumns()} minRows={3} />
            </div>
          );
        }}
      />
      <AddUser
        show={isModalshown}
        onClose={toggleModal}
        initialValues={toJS(selected)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default observer(UsersManagement);
