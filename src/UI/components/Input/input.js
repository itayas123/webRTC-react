import React, { useRef } from "react";
import "./input.css";
const Input = values => {
  const { placeholder, type } = values;
  const inputRef = useRef(null);
  return (
    <div className="input-div">
      <input {...values} ref={inputRef} />
      {type === "checkbox" && (
        <label
          onClick={() => {
            inputRef.current.click();
          }}
        >
          {placeholder}
        </label>
      )}
    </div>
  );
};

export default Input;
