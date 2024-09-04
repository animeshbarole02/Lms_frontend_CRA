
import './toolTip.css'; 
const Tooltip = ({ children, message }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-text">{message}</span>
    </div>
  );
};

export default Tooltip;