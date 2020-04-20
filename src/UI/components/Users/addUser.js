import { FieldArray, Form, Formik } from "formik";
import React from "react";
import Button from "../Button/button";
import Checkbox from "../Input/checkbox";
import Modal from "../Modal/modal";
import { validateEmail } from "../../../utils";
import FormError from "../Input/formError";

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!validateEmail(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "At least 8 characters";
  }
  if (!values.name) {
    errors.name = "Required";
  }
  return errors;
};

const AddUser = ({ show, onClose, initialValues, onSubmit }) => {
  return (
    <Modal show={show} handleClose={onClose} title="Add/Edit User">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form autoComplete="off" className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              autoComplete="off"
            />
            <FormError name="email" />
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              autoComplete="off"
            />
            <FormError name="password" />
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
            <Checkbox
              name="admin"
              placeholder="Is Admin ?"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.admin}
            />
            {values.sources && (
              <>
                <h3 className="sources-title">sources</h3>
                <div className="sources">
                  <FieldArray name="sources">
                    {({ form }) => (
                      <>
                        {form.values.sources.map((source, index) => (
                          <Checkbox
                            key={source._id}
                            name={`sources[${index}].isActive`}
                            placeholder={source.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={source.isActive}
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
export default AddUser;
