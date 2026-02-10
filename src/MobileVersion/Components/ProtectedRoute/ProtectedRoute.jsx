import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../../utils/auth.util";

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;