import React from "react";

export default function InputText({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
  required = false,
}) {
  return (
    <div className="input-text-wrapper">
      {label && (
        <label htmlFor={name} className="input-text-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        className={`input-text-field ${error ? "input-error" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error && <p className="input-text-error">{error}</p>}
    </div>
  );
}
