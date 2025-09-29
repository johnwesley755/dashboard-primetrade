import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ProfilePage from './pages/ProfilePage';
import { useEffect } from "react";

function App() {
  // Add dark mode class to body if user prefers dark mode
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('bg-gray-100');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
          <p>© {new Date().getFullYear()} MyNotesApp - All rights reserved</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
