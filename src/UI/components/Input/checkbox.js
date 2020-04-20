import React, { useRef } from "react";
import "./form.css";

const Checkbox = (values) => {
  const { placeholder, value, name } = values;
  const id = `toggle-${name}`;
  const inputRef = useRef(null);
  return (
    <div className="checkbox-div">
      <input
        {...values}
        type="checkbox"
        ref={inputRef}
        id={id}
        className="checkbox"
        checked={value}
      />
      <label htmlFor={id} className="switch"></label>
      <span
        className="placeholder"
        onClick={() => {
          inputRef.current.click();
        }}
      >
        {placeholder}
      </span>
    </div>
  );
};

export default Checkbox;
