import { useState, useEffect } from "react";
import Button from "../Button/button";

const Dynamicform = ({
  fields,
  onSubmit,
  heading,
  isEditMode,
  initialData = {},
}) => {

    const [formData, setFormData] = useState(() =>
        fields.reduce((acc, field) => {
          acc[field.name] = initialData[field.name] || "";
          return acc;
        }, {})
      );


      useEffect(() => {
        setFormData((prevData) => ({
          ...prevData,
          ...initialData,
        }));
      }, [initialData]);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
      };
    

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="modal-form-heading">
          <h2>{heading}</h2>
        </div>

        <div className="modal-form-input-div">
          {fields.map((field) => (
            <div key={field.name} className="modal-form-input">
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        <div className="modal-form-btn-div">
          <Button
            type="submit"
            text={isEditMode ? "Edit" : "Add"}
            className="modal-form-btn"
          />
        </div>
      </form>
    </div>
  );
};

export default Dynamicform;
