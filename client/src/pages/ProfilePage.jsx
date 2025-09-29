    // client/src/pages/ProfilePage.jsx
    import { useState, useEffect } from "react";
    import axios from "axios";

    const ProfilePage = () => {
    const [user, setUser] = useState({ name: "", email: "" });
    const [newName, setNewName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const API_URL = "https://dashboard-primetrade.onrender.com/api/auth";

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(
            `${API_URL}/profile`,
            getAuthHeaders()
            );
            setUser(data);
            setNewName(data.name);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            setMessage({ 
            text: "Failed to load profile. Please try again later.", 
            type: "error" 
            });
            setIsLoading(false);
        }
        };
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
        const { data } = await axios.put(
            `${API_URL}/profile`,
            { name: newName },
            getAuthHeaders()
        );
        setUser(data);
        localStorage.setItem("userName", data.name);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } catch (error) {
        setMessage({ 
            text: error.response?.data?.message || "Failed to update profile.", 
            type: "error" 
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } finally {
        setIsUpdating(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
        setMessage({ text: "New passwords do not match.", type: "error" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        return;
        }
        
        setIsChangingPassword(true);
        try {
        await axios.put(
            `${API_URL}/change-password`,
            { oldPassword, newPassword },
            getAuthHeaders()
        );
        setMessage({ text: "Password changed successfully!", type: "success" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } catch (error) {
        setMessage({ 
            text: error.response?.data?.message || "Failed to change password.", 
            type: "error" 
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } finally {
        setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-lg p-6 mb-8 text-white">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="mt-2 text-blue-200">Manage your account information and security</p>
        </div>
        
        {message.text && (
            <div className={`p-4 mb-6 rounded-md ${
            message.type === "success" 
                ? "bg-green-100 text-green-800 border-l-4 border-green-500" 
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}>
            <div className="flex items-center">
                {message.type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                )}
                <p>{message.text}</p>
            </div>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
            {/* Update Profile Form */}
            <form
            onSubmit={handleProfileUpdate}
            className="p-6 bg-white rounded-lg shadow-md"
            >
            <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
            </div>
            
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
                </label>
                <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border rounded-md bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Your email cannot be changed</p>
            </div>
            
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                Display Name
                </label>
                <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            
            <button
                type="submit"
                disabled={isUpdating}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isUpdating ? (
                <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Updating...
                </>
                ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                </>
                )}
            </button>
            </form>

            {/* Change Password Form */}
            <form
            onSubmit={handlePasswordChange}
            className="p-6 bg-white rounded-lg shadow-md"
            >
            <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Security</h2>
            </div>
            
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                Current Password
                </label>
                <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                />
            </div>
            
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                New Password
                </label>
                <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                />
            </div>
            
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm New Password
                </label>
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                />
            </div>
            
            <button
                type="submit"
                disabled={isChangingPassword}
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center ${isChangingPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isChangingPassword ? (
                <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Updating Password...
                </>
                ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Change Password
                </>
                )}
            </button>
            </form>
        </div>
        </div>
    );
    };

    export default ProfilePage;
