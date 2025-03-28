import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/app/store";

interface AntiProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const AntiProtectedRoute: React.FC<AntiProtectedRouteProps> = ({
  children,
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (
    auth.isAuthenticated &&
    (location.pathname === "/signin" ||
      location.pathname === "/signup" ||
      location.pathname === "/admin/signin" ||
      location.pathname === "/doctor/sigin")
  ) {
    if (auth.role === "admin") {
      return (
        <Navigate to={location.state?.from ?? `/admin/dashboard`} replace />
      );
    } else if (auth.role === "doctor") {
      return (
        <Navigate to={location.state?.from ?? `/doctor/dashboard`} replace />
      );
    } else if (auth.role === "patient") {
      return <Navigate to={location.state?.from ?? `/visitnow`} replace />;
    }
  }

  return <>{children}</>;
};

export default AntiProtectedRoute;
