import "./App.css";
import Books from "./pages/Books/books";
import Categories from "./pages/Categories/categories";
import Dashboard from "./pages/Dashboard/dashboard";
import Login from "./pages/Login/login";
import Users from "./pages/Users/users";
import Issuances from "./pages/Issuances/issuances";
import UserHistory from "./pages/UserHistory/userHistory";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./style/style.css";
import ProtectedRoute from "./routers/protectedRoute";
import { useEffect } from "react";

import {
  setAuthFromLocalStorage,
  loginSuccess,
  logout,
} from "./redux/authSlice"; 
import History from "./pages/Histories/userPageHistory";
import BookHistory from "./pages/Histories/bookPageHistory";



function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthFromLocalStorage({ jwtToken: token }));
      fetchUserInfo(token);
    } else {
      dispatch(logout());
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
        
      } else {
        dispatch(logout()); 
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      dispatch(logout()); 
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                < Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Books />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issuances"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Issuances />
              </ProtectedRoute>
            }
          />
          

          <Route 
              path="/history"
              element = {
                <ProtectedRoute allowedRoles ={["ADMIN"]}>
                   <History/>
                </ProtectedRoute>
              }
          />
          <Route
            path="/userHistory"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserHistory />
              </ProtectedRoute>
            }
          />
            <Route
            path="//bookHistory"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <BookHistory />
              </ProtectedRoute>
            }
          />

             <Route
            path="*"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/" />
            }
          />
        </Routes>


     
      </div>
    </BrowserRouter>
  );
}

export default App;
