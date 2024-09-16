import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";



const ProtectedRoute = ({ children }) => {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation(); 

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;