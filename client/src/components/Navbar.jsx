// client/src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const userName = localStorage.getItem("userName");
  
  const isActive = (path) => {
    return location.pathname === path ? "text-blue-300" : "text-white";
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to={token ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold text-white">MyNotesApp</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className={`hover:text-blue-300 transition duration-200 ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/profile" className={`hover:text-blue-300 transition duration-200 ${isActive('/profile')}`}>
                  Profile
                </Link>
                <div className="flex items-center space-x-2 bg-blue-700 bg-opacity-30 px-3 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-blue-100">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className={`hover:text-blue-300 transition duration-200 ${isActive('/login')}`}>
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            {token ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 bg-blue-700 bg-opacity-30 px-3 py-2 rounded-md mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-blue-100">{userName}</span>
                </div>
                <Link to="/dashboard" className="text-white hover:bg-blue-700 hover:bg-opacity-30 px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-white hover:bg-blue-700 hover:bg-opacity-30 px-3 py-2 rounded-md">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center w-full justify-center mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="text-white hover:bg-blue-700 hover:bg-opacity-30 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
