import "./button.css";

const Button = ({ onClick, text,className, disabled }) => {
  return (
    <div className="button-component-div">
      <button
        className={`custom-button ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
