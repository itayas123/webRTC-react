import { FieldArray, Form, Formik } from "formik";
import React from "react";
import Button from "../Button/button";
import Checkbox from "../Input/checkbox";
import Modal from "../Modal/modal";
import { validateUri } from "../../../utils";
import FormError from "../Input/formError";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.uri) {
    errors.uri = "Required";
  } else if (!validateUri(values.uri)) {
    errors.uri = "Invalid uri address";
  }
  return errors;
};

const AddSource = ({ show, onClose, initialValues, onSubmit }) => {
  return (
    <Modal show={show} handleClose={onClose} title="Add/Edit Source">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              autoComplete="off"
            />
            <FormError name="name" />
            <input
              type="text"
              name="uri"
              placeholder="uri"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.uri}
              autoComplete="off"
            />
            <FormError name="uri" />
            {values.users && (
              <>
                <h3>users</h3>
                <div className="users">
                  <FieldArray name="users">
                    {({ form }) => (
                      <>
                        {form.values.users.map((user, index) => (
                          <Checkbox
                            key={user._id}
                            name={`users[${index}].isActive`}
                            placeholder={user.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={user.isActive}
                          />
                        ))}
                      </>
                    )}
                  </FieldArray>
                </div>
              </>
            )}
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default AddSource;
