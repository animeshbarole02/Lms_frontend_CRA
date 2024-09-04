import React from "react";

const Toast = ({ message, type, isOpen, onClose }) => {

    if (!isOpen) return null;
  return (

 

    <div className="toast-div">
    <div className={`toast ${type}`}>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </div>
    </div> 
  );
};

export default Toast;
