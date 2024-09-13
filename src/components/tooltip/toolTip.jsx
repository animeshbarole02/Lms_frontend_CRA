
import './toolTip.css'; 
const Tooltip = ({ children, message, className }) => {
  return (
    <div className={`tooltip-container ${className}`}>
      {children}
      <span className="tooltip-text">{message}</span>
    </div>
  );
};

export default Tooltip;