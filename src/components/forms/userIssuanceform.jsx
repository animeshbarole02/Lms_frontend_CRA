import { useState } from "react";
import { findBookByTitle } from "../../api/services/bookApi";
import "./issuanceform.css";
import Button from "../Button/button";
import { formatDateTime } from "../../utils/formateDateOrTime";

const UserIssuanceform = ({ onSubmit, selectedUser, onClose }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [bookId, setBookId] = useState(null);
  const [issuanceType, setIssuanceType] = useState("Home");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(new Date().toISOString().slice(0, 19));
  const [expectedReturn, setExpectedReturn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBookDetails = async (bookTitle) => {
    try {
      const bookDetails = await findBookByTitle(bookTitle);
      setBookId(bookDetails.id);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to fetch Books details:", error);
      setBookId(null);
      setErrorMessage("Book is not found.");
    }
  };

  const handleBookTitleChange = (e) => {
    const bookTitle = e.target.value;
    setBookTitle(bookTitle);
    fetchBookDetails(bookTitle);
  };



  const handleSubmit = (event) => {
    event.preventDefault();

    if (!bookId) {
      setErrorMessage("Please enter a valid Title and try again.");
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
      userId: selectedUser.id,
      bookId,
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
      <h2>Issue User <br /><span>{selectedUser.name}</span></h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book Title</label>
          <input 
            type="text"
            value={bookTitle}
            onChange={handleBookTitleChange}
            placeholder="Enter Book Title"
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

        <Button
          className="submit-button"
          text="Issue Book"
        />
      </form>
    </div>
  );
};

export default UserIssuanceform;
