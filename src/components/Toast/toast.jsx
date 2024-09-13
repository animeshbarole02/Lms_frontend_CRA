import React, { useEffect } from "react";
import './toast.css';

const Toast = ({ message, type, isOpen, onClose }) => {


  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 3000);

 
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);



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
