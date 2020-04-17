import { FieldArray, Form, Formik } from "formik";
import React from "react";
import Button from "../Button/button";
import Checkbox from "../Input/checkbox";
import Modal from "../Modal/modal";

const AddUser = ({ show, onClose, initialValues, onSubmit }) => {
  return (
    <Modal show={show} handleClose={onClose} title="Add/Edit User">
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
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              autoComplete="off"
            />
            <input
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              autoComplete="off"
            />
            <Checkbox
              name="admin"
              placeholder="Is Admin ?"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.admin}
            />
            {values.sources && (
              <>
                <h3>sources</h3>
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
