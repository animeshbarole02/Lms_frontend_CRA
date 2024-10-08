import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LibraryLogo from "../../assets/icons/WithoutBorder.png";
import Button from "../../components/button/button";
import "./login.css";
import { useDispatch } from "react-redux";
import { loginSuccess, setAuthFromLocalStorage, setError } from "../../redux/authSlice";
import { BASE_URL, CURRENT_USER, SIGNIN_BASE_URL } from "../../api/apiConstants";

const Login = () => {
  const [usernameOrPhoneNumber, setUsernameOrPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthFromLocalStorage({ jwtToken: token }));
      fetchUserInfo(token);
    }
  });

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}${CURRENT_USER}`, {
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedInput = usernameOrPhoneNumber.trim();
    const trimmedPassword = password.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com)$/;
    const phonePattern = /^[0-9]{10}$/;

    let hasError = false;

  
    setUsernameError("");
    setPasswordError("");

    if (!trimmedInput) {
      setUsernameError("Please enter your email or mobile number.");
      hasError = true;
    } else if (!emailPattern.test(trimmedInput) && !phonePattern.test(trimmedInput)) {
      setUsernameError("Please enter a valid email (ending with '.com') or a 10-digit mobile number.");
      hasError = true;
    }

   
    if (!trimmedPassword) {
      setPasswordError("Please enter your password.");
      hasError = true;
    }

    if (hasError) return;

    const encryptedPassword = btoa(trimmedPassword);

    const payload = {
      usernameOrPhoneNumber: trimmedInput,
      password: encryptedPassword,
    };

    try {
    
      const response = await fetch(`${BASE_URL}${SIGNIN_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.Message && data.Message === "Bad credentials") {

        setPasswordError("Invalid password. Please try again.");
       
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
    } finally {
     
    }
  };

  const handleUsernameChange = (e) => {
    setUsernameOrPhoneNumber(e.target.value);
    if (e.target.value.trim()) {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim()) {
      setPasswordError("");
    }
  };

  return (
    <div className="outline-div">
      <div className="login-div">
        <div className="left-page">
          <div className="input-div">
            <div className="text">
              <h2>Log in</h2>
            </div>
            <div className="form">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="login-label" htmlFor="username">Email or Mobile Number</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={usernameOrPhoneNumber}
                    onChange={handleUsernameChange}
                    placeholder="Enter your email or mobile number"
                  />
                  {usernameError && <p className="error-message">{usernameError}</p>}
                </div>

                <div className="form-group">
                  <label className ="login-label"htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={handlePasswordChange}
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
              <p>Your gateway to a world of knowledge.</p>
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
