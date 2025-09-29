import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Simulate token validation check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If token exists, render the children components
  return children;
};

export default ProtectedRoute;
