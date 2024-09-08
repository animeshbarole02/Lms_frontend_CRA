import React from "react";
import './toast.css';

const Toast = ({ message, type, isOpen, onClose }) => {
  if (!isOpen) return null;

  const toastType = type === "success" ? "toast-success" : "toast-error";

  return (
    <div className="toast-div">
      <div className={`toast ${toastType}`}>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
