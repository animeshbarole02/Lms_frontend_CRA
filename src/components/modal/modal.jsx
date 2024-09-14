import "./modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" >
      <div className="modal-content" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
