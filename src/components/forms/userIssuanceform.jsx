import { useState } from "react";
import {

  findBookSuggestions,
} from "../../api/services/actions/bookActions";
import "./issuanceform.css";
import Button from "../button/button";
import { formatDateTime } from "../../utils/formateDateOrTime";
import Input from "../Input/input";

const UserIssuanceform = ({ onSubmit, selectedUser, onClose }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [bookId, setBookId] = useState(null);
  const [issuanceType, setIssuanceType] = useState("Home");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(formatDateTime(new Date().toLocaleString())); //
  const [expectedReturn, setExpectedReturn] = useState("");
 
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [errors, setErrors] = useState({ bookTitle: "", returnDate: "" });

  const fetchBookSuggestions = async (query) => {
    if (query.length < 2) {
      setBookSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await findBookSuggestions(query);
      const suggestions = response.data;
      const availableBooks = suggestions.filter((book) => book.quantity > 0);

      setBookSuggestions(availableBooks);
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to fetch book suggestions:", error);
      setBookSuggestions([]);
    }
  };

  const handleBookTitleChange = (e) => {
    const title = e.target.value;
    setBookTitle(title);
    fetchBookSuggestions(title);
  };

  const handleSuggestionClick = (book) => {
    setBookTitle(book.title);
    setBookId(book.id);
    setShowDropdown(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!bookId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        bookTitle: "Please enter a valid book title.",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, bookTitle: "" }));
    }

    if (issuanceType === "Home" && !expectedReturn) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Please enter a valid return date.",
      }));
      return;
    } else if (issuanceType === "Library" && !returnTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        returnDate: "Please enter a valid return time.",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, returnDate: "" }));
    }
    let returnedAt = null;

  
    if (issuanceType === "Home" && expectedReturn) {
      returnedAt = formatDateTime(new Date(expectedReturn).toLocaleString());
    }
   
    else if (issuanceType === "Library" && returnTime) {
      const currentDate = new Date().toISOString().slice(0, 10);
      returnedAt = formatDateTime(
        new Date(`${currentDate}T${returnTime}`).toLocaleString()
      );
    }
    const issuanceDetails = {
      userId: selectedUser.id,
      bookId,
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
        Issue User <br />
        <span style={{ color: 'black' }}>{selectedUser.name}</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book Title</label>
          <Input
            field={{ type: "text", name: "bookTitle", placeholder: "Enter Book Title" }}
            value={bookTitle}
            onChange={handleBookTitleChange}
          />
          {showDropdown && bookSuggestions.length > 0 && (
            <ul className="dropdown-suggestions">
              {bookSuggestions.map((book) => (
                <li key={book.id} onClick={() => handleSuggestionClick(book)}>
                  {book.title}
                </li>
              ))}
            </ul>
          )}
          {errors.bookTitle && (
            <p className="error-message">{errors.bookTitle}</p>
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
            <Input
            field={{
              type: "datetime-local",
              name: "expectedReturn",
              min: new Date().toISOString().slice(0, 16),
            }}
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
          />
          ) : (
            <Input
              field={{ type: "time", name: "returnTime" }}
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          )}
          {errors.returnDate && (
            <p className="error-message">{errors.returnDate}</p>
          )}
        </div>

        <Button className="submit-button" text="Issue Book" />
      </form>
    </div>
  );
};

export default UserIssuanceform;
