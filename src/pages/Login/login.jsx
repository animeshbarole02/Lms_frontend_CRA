import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LibraryLogo from "../../assets/icons/WithoutBorder.png";
// import Loader from "../../assets/icons/Loader.gif";
import Button from "../../components/button/button";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";

import { loginSuccess, setAuthFromLocalStorage, setError } from "../../redux/authSlice";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [usernameOrPhoneNumber, setUsernameOrPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthFromLocalStorage({ jwtToken: token }));
      fetchUserInfo(token);
    }
  }, [dispatch]);

  const fetchUserInfo = async (token) => {
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/currentUser", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(loginSuccess({ user: data, jwtToken: token }));
        if (data.role === "ADMIN") {
          navigate("/dashboard");
        } else if (data.role === "USER") {
          navigate("/userHistory");
        }
      } else {
        dispatch(setError("Failed to fetch user information."));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      dispatch(setError("An error occurred. Please try again later."));
    }
  };

  const handleUserTypeChange = (type) => {
    setIsAdmin(type === "ADMIN");
    setUsernameOrPhoneNumber("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const trimmedInput = usernameOrPhoneNumber.trim();
    const trimmedPassword = password.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
  
    let hasError = false;
  
    // Reset errors
    setUsernameError("");
    setPasswordError("");
  
    // Validation for username or phone number
    if (!trimmedInput) {
      setUsernameError(
        isAdmin ? "Please enter your email address." : "Please enter your mobile number."
      );
      hasError = true;
    } else if (isAdmin && !emailPattern.test(trimmedInput)) {
      setUsernameError("Please enter a valid email address for admin login.");
      hasError = true;
    } else if (!isAdmin && !phonePattern.test(trimmedInput)) {
      setUsernameError("Please enter a valid mobile number for user login.");
      hasError = true;
    }
  
    // If username or phone number is valid, then validate password
    if (!hasError) {
      if (!trimmedPassword) {
        setPasswordError("Please enter your password.");
        hasError = true;
      }
    }
  
    if (hasError) return;
  
    const encryptedPassword = btoa(trimmedPassword);
  
    const payload = {
      usernameOrPhoneNumber: trimmedInput,
      password: encryptedPassword,
    };
  
  
    try {
      // setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data.Message && data.Message === "Bad credentials") {
        setUsernameError(isAdmin ? "Invalid email or password." : "Invalid mobile number or password.");
        // setLoading(false);

        return;
      }
  
      if (response.ok) {
        localStorage.setItem("token", data.jwtToken);
        dispatch(loginSuccess({ user: data, jwtToken: data.jwtToken }));
  
        if (data.role === "ROLE_ADMIN") {
          navigate("/dashboard");
        } else if (data.role === "ROLE_USER") {
          navigate("/userHistory");
        } else {
          navigate("/");
        }
      } else {
        dispatch(setError(data.message || "Login failed. Please try again."));
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(setError("An error occurred. Please try again later."));
    }finally {
      // setLoading(false);
    }
  };

  return (
    <div className="outline-div">
      {/* {loading && (
      <div className="loader">
        <img src={Loader} alt="Loading..." />
      </div>
    )} */}
      <div className="login-div">
        <div className="left-page">
          <div className="input-div">
            <div className="text">
              <h2>Log in</h2>
            </div>
            <div className="choose">
              <Button
                text="Admin"
                active={isAdmin}
                onClick={() => handleUserTypeChange("ADMIN")}
              />
              <Button
                text="User"
                active={!isAdmin}
                onClick={() => handleUserTypeChange("USER")}
              />
            </div>
            <div className="form">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">
                    {isAdmin ? "Email" : "Enter Mobile Number"}
                  </label>
                  <input
                    type={isAdmin ? "text" : "tel"}
                    id="username"
                    name="username"
                    value={usernameOrPhoneNumber}
                    onChange={(e) => setUsernameOrPhoneNumber(e.target.value)}
                    placeholder={isAdmin ? "Enter your email" : "Enter your mobile number"}
                  />
                  {usernameError && <p className="error-message">{usernameError}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <div className="form-group button-div">
                  <Button text="Login" className="login-btn" />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="right-page">
          <div className="img-div">
            <div className="text">
              <h2>Library Management Portal</h2>
              <p>
                Your gateway to a world of knowledge. Manage your library account, explore our
                extensive collection, and keep track of your reading journey all in one place.
              </p>
            </div>
            <div className="icon">
              <img src={LibraryLogo} alt="Library Logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
