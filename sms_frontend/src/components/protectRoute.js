import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ allowedRoles }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role.toLowerCase())) {
    return <Navigate to="/unauthorize" replace />;
  }

  return <Outlet />; // nested routes will render here
};

export default ProtectRoute;