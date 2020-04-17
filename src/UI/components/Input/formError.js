import React from "react";
import { ErrorMessage } from "formik";

const FormError = ({ name, ...rest }) => {
  return (
    <ErrorMessage
      name={name}
      className="form-error"
      component="span"
      {...rest}
    />
  );
};

export default FormError;
