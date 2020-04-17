import React, { useRef } from "react";
import "./input.css";

const Checkbox = (values) => {
  const { placeholder } = values;
  const inputRef = useRef(null);
  return (
    <div className="input-div">
      <input {...values} type="checkbox" ref={inputRef} />
      <label
        onClick={() => {
          inputRef.current.click();
        }}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default Checkbox;
