import { useState, useEffect } from "react";
import Button from "../button/button";
import Input from "../Input/input"; 

const DynamicForm = ({
  fields,
  onSubmit,
  heading,
  isEditMode,
  initialData = {},
  errors = {},
  
}) => {
  const [formData, setFormData] = useState(initialData);
  const [fieldErrors, setFieldErrors] = useState(errors);
  useEffect(() => {

    if (isEditMode) {
      setFormData(initialData);
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    setFieldErrors(errors);
  }, [errors]);

  const handleInputChange = (e) => {

    
    const { name, value } = e.target;
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));
   
    clearError(name);

   
  };


  const clearError = (fieldName) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  

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
                <Input
                  field={field}
                  value={formData[field.name] || ""} 
                  onChange={handleInputChange}
                  min={field.min}
                />
              )}
              {fieldErrors[field.name] && (
                <p className="error-message">{fieldErrors[field.name]}</p>
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

export default DynamicForm;
