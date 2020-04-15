import React, { useEffect } from "react";
import Button from "../../components/Button/button";
import DataTable from "../../components/DataTable/dataTable";
import { observer } from "mobx-react";
import stores from "../../../stores";
import { toJS } from "mobx";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../../Routes";
import { deleteIcon, editIcon } from "../../../assets";
import "./users.css";
import AddUser from "../../components/Users/addUser";

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
            if (window.confirm("Are you sure?"))
              userStore.delete(row._original._id);
          }}
        />
        <img
          src={editIcon}
          alt="edit"
          onClick={() => {
            toggleModal();
            userStore.setSelected(row._original);
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
    if (user._id) await update(user);
    else await create(user);
    toggleModal();
  } catch (err) {
    alert(err);
  }
};

const Users = () => {
  useEffect(() => {
    userStore.fetchAll();
    sourceStore.fetchAll();
  }, []);

  const { list, getUser, isModalshown, selected, setSelected } = userStore;
  if (!getUser.admin) return <Redirect to={ROUTES.HOME} />;
  return (
    <div className="users-container">
      <h1>Users Management</h1>
      <Button
        className="add-user"
        onClick={() => {
          toggleModal();
          setSelected({ sources: [] });
        }}
      >
        Add User
      </Button>
      <DataTable columns={columns} data={toJS(list)} />
      <AddUser
        show={isModalshown}
        onClose={toggleModal}
        initialValues={toJS(selected)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default observer(Users);
