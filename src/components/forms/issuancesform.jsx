import { useState } from "react";
import "./issuanceform.css"; // Add appropriate CSS styling
import { findUserByMobile } from "../../api/services/usersApi";
import Button from "../Button/button";
import { formatDateTime } from "../../utils/formateDateOrTime";




const IssuanceForm = ({ onSubmit, selectedBook, onClose }) => {
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [userId, setUserId] = useState(null);
  const [issuanceType, setIssuanceType] = useState("Home");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(formatDateTime(new Date())); 
  const [expectedReturn, setExpectedReturn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserDetails = async (mobileNumber) => {
    try {
      const userDetails = await findUserByMobile(mobileNumber);
      setUserId(userDetails.id);
      setErrorMessage(""); 
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUserId(null); 
      setErrorMessage("User not found. Please register first.");
    }
  };

  const handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value;
    setUserMobileNumber(mobileNumber);

    if (mobileNumber.length === 10) {

      fetchUserDetails(mobileNumber); 
    } else {
      setUserId(null); 
      setErrorMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userId) {
      setErrorMessage("Please enter a valid mobile number and try again.");
      return;
    }

    let returnedAt = null;
    if (issuanceType === "Home" && returnDate) {
      returnedAt = formatDateTime(`${returnDate}T23:59:59`); 
    } else if (issuanceType === "Library" && returnTime) {
      const currentDate = new Date().toISOString().slice(0, 10); 
      returnedAt = formatDateTime(`${currentDate}T${returnTime}`); 
    }

    const issuanceDetails = {
      userId, 
      bookId: selectedBook.id,
      issuedAt,
      returnedAt,
      expectedReturn: formatDateTime(expectedReturn),
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
        <span>{selectedBook.title}</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            value={userMobileNumber}
            onChange={handleMobileNumberChange}
            placeholder="Enter User Mobile Number"
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <div className="form-group">
          <label>Issuance Type</label>
          <select
            value={issuanceType}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="Home">Home</option>
            <option value="Library">Library</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expected Return</label>
          <input
            type="datetime-local"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            required
          />
        </div>

        <Button className="submit-button" text="Issue Book" />
      </form>
    </div>
  );
};

export default IssuanceForm;
