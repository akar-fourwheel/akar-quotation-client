import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Outlet, Navigate } from "react-router";

const ProtectedRoute = ({ roles }) => {
  const { user,role, isAuthenticated } = useContext(AuthContext);
  console.log(isAuthenticated);
  

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
