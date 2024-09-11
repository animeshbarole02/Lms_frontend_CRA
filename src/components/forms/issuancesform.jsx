import { useState } from "react";
import "./issuanceform.css";
import { findUserByMobile } from "../../api/services/actions/usersActions";
import Button from "../button/button";
import { formatDateTime } from "../../utils/formateDateOrTime";
import { useNavigate } from "react-router-dom";
import { now } from "../../utils/currentDate";

const IssuanceForm = ({ onSubmit, selectedBook, onClose }) => {
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [issuanceType, setIssuanceType] = useState("Home");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(formatDateTime(new Date().toLocaleString()));
  const [expectedReturn, setExpectedReturn] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ mobileNumber: "", returnDate: "" });

  const fetchUserDetails = async (mobileNumber) => {
    try {
      const userDetails = await findUserByMobile(mobileNumber);
      console.log(userDetails);
      setUserName(userDetails.name);
      setUserId(userDetails.id);
      setMessage(`User with Name ${userDetails.name} found`);
      setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: "" }));
    } catch (error) {
      setUserId(null);
      setMessage("User not found. Please register first.");
    }
  };

  const handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value;
    setUserMobileNumber(mobileNumber);

    if (mobileNumber.length === 10) {
      fetchUserDetails(mobileNumber);
    } else {
      setUserId(null);
      setMessage("");
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: mobileNumber.length > 0 ? "Please enter a valid mobile number." : "",
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: "Please enter a valid mobile number and try again.",
      }));
      return;
    }

    if (issuanceType === "Home" && !expectedReturn) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Please enter a valid return date.",
      }));
      return;
    }

    if (issuanceType === "Library" && !returnTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Please enter a valid return time.",
      }));
      return;
    }
    let returnedAt = null;

    if (issuanceType === "Home" && expectedReturn) {
      returnedAt = formatDateTime(new Date(expectedReturn).toLocaleString());
    } else if (issuanceType === "Library" && returnTime) {
      const currentDate = new Date().toISOString().slice(0, 10); // Get the current date
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
        <span style={{ color: 'black' }}>{selectedBook.title}</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            value={userMobileNumber}
            onChange={handleMobileNumberChange}
            placeholder="Enter User Mobile Number"
          />
 {message && (
    <p
      className={`message ${userId ? "success-message" : "error-message"}`}
    >
      {message}
    </p>
  )}
        </div>

        <div className="form-group">
          <label>Issuance Type</label>
          <select
            value={issuanceType}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="Home">Take Away</option>
            <option value="Library">In House</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expected Return</label>
          {issuanceType === "Home" ? (
            <>
              <input
                type="datetime-local"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />

              {errors.returnDate && (
                <p className="error-message">{errors.returnDate}</p>
              )}
            </>
          ) : (
            <>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
              />
            </>
          )}
        </div>

        <Button className="submit-button" text="Issue Book" />
      </form>
    </div>
  );
};

export default IssuanceForm;
