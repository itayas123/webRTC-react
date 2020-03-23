import React from "react";
import "./button.css";

const Button = ({ children, className, ...rest }) => {
  return (
    <button className={`custom-button ${className || ""}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
