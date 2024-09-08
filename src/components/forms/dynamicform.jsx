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

  useEffect(() => {
    setFormData(initialData);
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
              <Input
                field={field}
                value={formData[field.name]}
                onChange={handleInputChange}
                min={field.min}
              
              />
               {errors[field.name] && (
                <p className="error-message">{errors[field.name]}</p>
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
