import { useState } from "react";
import "./issuanceform.css";
import { findUserByMobile } from "../../api/services/actions/usersActions";
import Button from "../button/button";
import { formatDateTime } from "../../utils/formateDateOrTime";
import Input from "../input/input";

const IssuanceForm = ({ onSubmit, selectedBook, onClose }) => {
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [userId, setUserId] = useState(null);
  const [issuanceType, setIssuanceType] = useState("Home");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(formatDateTime(new Date().toLocaleString()));
  const [expectedReturn, setExpectedReturn] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ mobileNumber: "", returnDate: "" });

  const fetchUserDetails = async (mobileNumber) => {
    const response = await findUserByMobile(mobileNumber);

    if (response) {
      if (response.data && response.data.name) {
      
        setUserId(response.data.id);
        setMessage(`User with Name ${response.data.name} found.`);
        setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: "" }));
      } else {
        setUserId(null);
        setMessage("User not found. Please register first.");
      }
    }
  };
  const handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value;
    setUserMobileNumber(mobileNumber);

    if (mobileNumber.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: "",
      }));
    }
    if (mobileNumber.length < 10) {
      setMessage("");
    }

    if (mobileNumber.length === 10) {
      fetchUserDetails(mobileNumber);
    }
  };

  const handleReturnTimeChange = (e) => {
    const selectedTime = e.target.value;
    const currentTime = new Date().toTimeString().slice(0, 5);

    if (selectedTime < currentTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Cannot select a time earlier than the current time.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "",
      }));
      setReturnTime(selectedTime);
    }
  };

  const handleExpectedReturnChange = (e) => {
    const selectedDateTime = new Date(e.target.value).getTime();
    const currentDateTime = new Date().getTime();
  
    if (selectedDateTime < currentDateTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Cannot select a return date/time earlier than the current date/time.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "",
      }));
      setExpectedReturn(e.target.value);
    }
  };
  


  const handleSubmit = (event) => {

    
    event.preventDefault();
    let hasError= false;
    const currentDate = new Date().toISOString().slice(0, 10); 
    setMessage("");
    
    if (!userMobileNumber) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: "Mobile number is required.",
      }));
      hasError = true;
    }

    if (!userId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: "Please enter a valid mobile number and try again.",
      }));
      hasError = true;
    }

    if(!expectedReturn) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Please enter a return date and try again.",
      }));
      
      hasError = true;

    }

    if(hasError)
    {
      return;
    }

    if (issuanceType === "Home" && !expectedReturn) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Expected return date is required.",
      }));
      return;
    }

    if (issuanceType === "Library" && !returnTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Expected return time is required.",
      }));
      return;
    }
     
    let returnedAt = null;

    if (issuanceType === "Home" && expectedReturn) {
      returnedAt = formatDateTime(new Date(expectedReturn).toLocaleString());
    } else if (issuanceType === "Library" && returnTime) {
     
      returnedAt = formatDateTime(
        new Date(`${currentDate}T${returnTime}`).toLocaleString()
      );
    }

    const issuanceDetails = {
      userId,
      bookId: selectedBook.id,
      issuedAt,
      returnedAt: null,
      expectedReturn: returnedAt,
      status: "Issued",
      issuanceType,
    };

    onSubmit(issuanceDetails);
    onClose();
  };

  return (
    <div className="issuance-form">
      <h2>
        Issue Book <br></br>
        <span style={{ color: "black" }}>{selectedBook.title}</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mobile Number</label>
          <Input
            field={{
              type: "text",
              name: "mobileNumber",
              placeholder: "Enter User Mobile Number",
            }}
            value={userMobileNumber}
            onChange={handleMobileNumberChange}
          />
          {errors.mobileNumber && (
            <p className="error-message">{errors.mobileNumber}</p>
          )}
          {message && (
            <p
              className={`message ${
                userId ? "success-message" : "error-message"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Issuance Type</label>
          <Input
            field={{
              type: "select",
              name: "issuanceType",
              placeholder: "Select Issuance Type",
              options: [
                { value: "Home", label: "Take Away" },
                { value: "Library", label: "In House" },
              ],
            }}
            value={issuanceType}
            onChange={(e) => setIssuanceType(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expected Return</label>
          {issuanceType === "Home" ? (
            <>
              <Input
                field={{
                  type: "datetime-local",
                  name: "expectedReturn",
                  min: new Date().toISOString().slice(0, 16),
                }}
                value={expectedReturn}
                onChange={handleExpectedReturnChange}
              />
              {errors.returnDate && (
                <p className="error-message">{errors.returnDate}</p>
              )}
            </>
          ) : (
            <>
              <Input
                field={{ type: "time", name: "returnTime" ,  min: new Date().toTimeString().slice(0, 5),}}
                value={returnTime}
               onChange={handleReturnTimeChange}

              />
              {errors.returnDate && (
                <p className="error-message">{errors.returnDate}</p>
              )}
            </>
          )}
        </div>

        <Button className="submit-button" text="Issue Book" />
      </form>
    </div>
  );
};

export default IssuanceForm;
