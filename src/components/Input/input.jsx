import React from "react";

const Input = ({ field, value, onChange, onFocus }) => {
  const { type, name, placeholder, options = [], min } = field;

  if (type === "select") {
    return (
      <select name={name} value={value || ""} onChange={onChange} onFocus={onFocus}>
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
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      min={type === "time" || type === "datetime-local" ? min : undefined} 
    />
  );
};

export default Input;
