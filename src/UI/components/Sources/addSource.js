import React from "react";
import Modal from "../Modal/modal";
import { Formik, Form, Field } from "formik";
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
              <Button type="submit">Submit</Button>
            </Form>
          );
        }}
      />
    </Modal>
  );
};
export default AddSource;
