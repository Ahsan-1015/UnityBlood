import React, { useContext } from 'react'
import { Navigate, useLocation } from "react-router";
import { AuthContext } from '../providers/AuthProvider';


export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
    const location = useLocation();

    if(loading){
        return (
            <div className='w-full h-60 flex items-center justify-center'>
                <span className="loading loading-bars loading-md"></span>
            </div>
        )
    }

    if (user) {
        return children;
    }
    return <Navigate to="/login" state={{from: location}} replace></Navigate>
}
