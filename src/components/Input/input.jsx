import React from "react";

const Input = ({ field, value, onChange ,min}) => {
  const { type, name, placeholder, options = [] } = field;

  if (type === "select") {
    return (
      <select name={name} value={value || ""} onChange={onChange}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      min={field.min}
    />
  );
};

export default Input;
