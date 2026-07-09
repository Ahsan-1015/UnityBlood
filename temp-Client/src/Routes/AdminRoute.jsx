import React, { useContext } from 'react'
import useAdmin from '../hooks/useAdmin'
import { AuthContext } from '../providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminRoute({ children }) {
    const {user, loading} = useContext(AuthContext)
    const [isAdmin,isAdminLoading] = useAdmin();
    const location = useLocation();
  
    
    if(loading || isAdminLoading){
        return <span className="loading loading-bars loading-md"></span>
    }

    if (user && isAdmin) {
        return children;
    }
    return <Navigate to="/login" state={{from: location}} replace></Navigate>
}
