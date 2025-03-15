import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/app/store";
import sharedService from "../services/shared/sharedService";
import { signOut } from "../redux/features/auth/authSlice";
import { clearUser } from "../redux/features/user/userSlice";
import Loading from "../components/basics/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("patient" | "doctor" | "admin")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await sharedService.checkUserStatus();
        setIsActive(result);

        if (!result) {
          dispatch(signOut());
          dispatch(clearUser());
        }
      } catch (error) {
        console.log("Error checking status", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      checkStatus();
    } else {
      setLoading(false);
    }
  }, [location.pathname, auth.isAuthenticated]);

  if (loading) return <Loading />;

  if (!auth.isAuthenticated || !isActive) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/signin" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith("/doctor")) {
      return (
        <Navigate to="/doctor/signin" state={{ from: location }} replace />
      );
    }
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!auth.role || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/401" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
