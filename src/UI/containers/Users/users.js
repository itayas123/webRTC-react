import React, { Component, useEffect } from "react";
import Button from "../../components/Button/button";
import DataTable from "../../components/DataTable/dataTable";
import { observer } from "mobx-react";
import stores from "../../../stores";
import { toJS } from "mobx";
import { Redirect } from "react-router-dom";
import { ROUTES } from "../../../Routes";
import { deleteIcon, editIcon } from "../../../assets";
import "./users.css";

const columns = [
  {
    Header: "email",
    accessor: "email",
    width: 200
  },
  {
    Header: "name",
    accessor: "name",
    width: 200
  },
  {
    Header: "admin",
    accessor: "admin",
    Cell: ({ row, value }) => <span>{value ? "Yes" : "No"}</span>,
    width: 200,
    filterMethod: (filter, row) => {
      const value = row.admin ? "Yes" : "No";
      return value.toLowerCase().includes(filter.value.toLowerCase());
    }
  },
  {
    Header: "password",
    accessor: "password",
    Cell: ({ row, value }) => (
      <span>
        {value
          .toString()
          .split("")
          .map(char => "*")}
      </span>
    ),
    width: 200,
    filterable: false
  },
  {
    Header: "",
    Cell: ({ row }) => {
      return (
        <div className="actions">
          <img src={deleteIcon} />
          <img src={editIcon} />
        </div>
      );
    },
    sortable: false,
    filterable: false,
    resizable: false,
    width: 150
  }
];

const { userStore } = stores;

const Users = ({}) => {
  useEffect(() => {
    userStore.fetchAllUsers();
  }, []);

  const { allUsers, getUser } = userStore;
  if (!getUser.admin) return <Redirect to={ROUTES.HOME} />;
  return (
    <div className="users-container">
      <h1>User Management</h1>
      <Button className="add-user">Add User</Button>
      <DataTable columns={columns} data={toJS(allUsers)} />
    </div>
  );
};

export default observer(Users);
