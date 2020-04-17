import { FieldArray, Form, Formik } from "formik";
import React from "react";
import Button from "../Button/button";
import Checkbox from "../Input/checkbox";
import Modal from "../Modal/modal";

const AddSource = ({ show, onClose, initialValues, onSubmit }) => {
  return (
    <Modal show={show} handleClose={onClose} title="Add/Edit Source">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
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
            <input
              type="text"
              name="uri"
              placeholder="uri"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.uri}
              autoComplete="off"
            />
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
