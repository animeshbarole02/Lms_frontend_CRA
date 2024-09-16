import "./button.css";

const Button = ({ onClick, text, active, className, disabled }) => {
  return (
    <div className="button-component-div">
      <button
        className={`custom-button ${active ? "active" : ""} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
