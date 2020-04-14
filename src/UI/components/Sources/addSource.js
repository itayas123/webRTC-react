import React from "react";
import Modal from "../Modal/modal";
import { Formik, Form, Field, FieldArray } from "formik";
import Input from "../Input/input";
import Button from "../Button/button";

const AddSource = ({ show, onClose, initialValues, onSubmit }) => {
  return (
    <Modal show={show} handleClose={onClose} title="Add/Edit Source">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ values }) => {
          return (
            <Form className="form">
              <Field
                name="name"
                render={({ field }) => (
                  <Input
                    placeholder="name"
                    id="name"
                    type="text"
                    autoComplete="new-password"
                    {...field}
                  />
                )}
              />
              <Field
                name="uri"
                render={({ field }) => (
                  <Input
                    placeholder="uri"
                    id="uri"
                    type="text"
                    autoComplete="new-password"
                    {...field}
                  />
                )}
              />
              <h3>users</h3>
              <div className="users">
                <FieldArray
                  name="users"
                  render={(array) =>
                    values.users &&
                    values.users.map((user, index) => (
                      <Field
                        name={`users[${index}].isActive`}
                        key={user._id}
                        render={({ field }) => (
                          <Input
                            id={`users[${index}].isActive`}
                            {...field}
                            type="checkbox"
                            checked={field.value}
                            placeholder={user.name}
                          />
                        )}
                      />
                    ))
                  }
                />
              </div>
              <Button type="submit">Submit</Button>
            </Form>
          );
        }}
      />
    </Modal>
  );
};
export default AddSource;
