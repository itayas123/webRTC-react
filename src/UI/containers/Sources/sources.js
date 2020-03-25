import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { deleteIcon, editIcon } from "../../../assets";
import { ROUTES } from "../../../Routes";
import stores from "../../../stores";
import Button from "../../components/Button/button";
import DataTable from "../../components/DataTable/dataTable";
import "../Users/users.css";
import AddSource from "../../components/Sources/addSource";

const columns = [
  {
    Header: "name",
    accessor: "name",
    width: 200
  },
  {
    Header: "uri",
    accessor: "uri",
    width: 450
  },
  {
    Header: "",
    Cell: ({ row }) => (
      <div className="actions">
        <img
          src={deleteIcon}
          onClick={() => {
            if (window.confirm("Are you sure?"))
              sourceStore.deleteSource(row._original);
          }}
        />
        <img
          src={editIcon}
          onClick={() => {
            toggleModal();
            sourceStore.setSelectedSource(row._original);
          }}
        />
      </div>
    ),
    sortable: false,
    filterable: false,
    resizable: false,
    width: 150
  }
];

const { userStore, sourceStore } = stores;

const toggleModal = () => {
  const { isModalshown, setIsModalShown } = sourceStore;
  setIsModalShown(!isModalshown);
};

const onSubmit = async values => {
  const { updateUser, createUser } = userStore;
  try {
    const user = {
      ...values,
      sources: values.sources
        .filter(source => source.isActive)
        .map(source => source._id)
    };
    if (user._id) await updateUser(user);
    else await createUser(user);
    toggleModal();
  } catch (err) {
    alert(err);
  }
};

const Sources = ({}) => {
  useEffect(() => {
    sourceStore.fetchAllSources();
  }, []);

  const { getUser } = userStore;
  const {
    sources,
    isModalshown,
    setSelectedSource,
    selectedSource
  } = sourceStore;
  if (!getUser.admin) return <Redirect to={ROUTES.HOME} />;
  return (
    <div className="users-container">
      <h1>Sources Management</h1>
      <Button
        className="add-user"
        onClick={() => {
          toggleModal();
          setSelectedSource({});
        }}
      >
        Add Source
      </Button>
      <DataTable columns={columns} data={toJS(sources)} />
      <AddSource
        show={isModalshown}
        onClose={toggleModal}
        initialValues={toJS(selectedSource)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default observer(Sources);
