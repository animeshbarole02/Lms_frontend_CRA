import Logo from "../../assets/icons/ReadingLogo.png";
import LogoutSwtich from "../../assets/icons/LogoutSwitch2.png";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmationModal from "../modal/confirmationModal";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCancelLogout = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="navbar-div">
      <div className="logo">
        <div className="logo-img">
          <img src={Logo} alt="logo-img" />
        </div>

        <div className="logo-text">
          <p>Readify</p>
        </div>
      </div>

      <div className="header">
        <div className="user-name">
          <p>Hello {user?.name || "Guest"}!</p>
          <br></br>
        </div>

        <div className="logout-button">
         
          <div className="img">
            <img
              src={LogoutSwtich}
              alt="Logout"
              className="logout-icon"
              onClick={openConfirmModal}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleLogout}
        message="Are you sure you want to log out?"
      />
    </div>
  );
};

export default Navbar;
