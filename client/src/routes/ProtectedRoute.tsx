
import React from 'react'
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/app/store";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: ('patient' | 'doctor' | 'admin')[];
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({  children, allowedRoles }) => {

    const auth = useSelector((state: RootState) => state.auth);
    
    const location = useLocation();

    if (!auth.isAuthenticated) {

        if (location.pathname.startsWith('/admin')) {
            return <Navigate to={ '/admin/signin' } state={{ from: location }} replace />
        }

        if (location.pathname.startsWith('/doctor')) {
            return <Navigate to={ '/doctor/signin' } state={{ from: location }} replace />
        }

        return <Navigate to={ '/signin' } state={{ from: location }} replace/>
    }

    if (!auth.role || !allowedRoles.includes(auth.role)) {
        return <Navigate to={ '/unauthorized'} replace />
    }


  return <>{children}</>
}

export default ProtectedRoute