import React from "react";
import Modal from "../Modal/modal";
import { Formik, Form, Field, FieldArray } from "formik";
import Input from "../Input/input";
import Button from "../Button/button";

const AddUser = ({ show, onClose, initialValues, onSubmit }) => {
  return (
    <Modal show={show} handleClose={onClose} title="Add/Edit User">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ values }) => {
          return (
            <Form className="form">
              <div>
                <Field
                  name="email"
                  render={({ field }) => (
                    <Input
                      placeholder="email"
                      id="email"
                      type="email"
                      autoComplete="new-password"
                      {...field}
                    />
                  )}
                />
                <Field
                  name="password"
                  render={({ field }) => (
                    <Input
                      placeholder="password"
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  )}
                />
              </div>
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
                name="admin"
                render={({ field }) => (
                  <Input
                    id="admin"
                    {...field}
                    type="checkbox"
                    checked={field.value}
                    placeholder="Is Admin?"
                  />
                )}
              />
              <h3>sources</h3>
              <div className="sources">
                <FieldArray
                  name="sources"
                  render={array =>
                    values.sources &&
                    values.sources.map((source, index) => (
                      <Field
                        name={`sources[${index}].isActive`}
                        render={({ field }) => (
                          <Input
                            id={`sources[${index}].isActive`}
                            {...field}
                            type="checkbox"
                            checked={field.value}
                            placeholder={source.name}
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
export default AddUser;
