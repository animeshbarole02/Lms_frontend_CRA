import Logo from "../../assets/icons/ReadingLogo.png";
import User from "../../assets/icons/user.png";
import LogoutSwtich from "../../assets/icons/LogoutSwitch2.png"
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const handleLogout = () => {
    localStorage.removeItem("token");
     navigate("/");
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
          <img src={User} alt=""></img>

          <p>Hello {user?.name || "Guest"}!</p> 
          <br></br>
        </div>


        <div className="mid-heading">
          <span>Read...</span>
          <span>Learn...</span>
          <span>Grow...</span>
        </div>

        <div className="logout-button">
          <div className="img">
            <img
              src={LogoutSwtich}
              alt="Logout"
              className="logout-icon"
              onClick={handleLogout}
            />
          </div>

          <div className="text">
                <span>logout</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
