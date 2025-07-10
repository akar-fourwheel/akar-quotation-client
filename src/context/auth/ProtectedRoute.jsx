import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Outlet, Navigate, useLocation } from "react-router";
import Loader from "../../Components/Loader/Loader";

const ProtectedRoute = ({ roles, children }) => {
  const { isAuthenticated, isLoading, role } = useContext(AuthContext);
  
  const location = useLocation();

  if (isLoading) {
    return <Loader />; // You might want to replace this with a proper loading component
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
