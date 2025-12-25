import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import Notifications from "./Notifications";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (auth.user?.role === "CLIENT") {
      const fetchNotifs = async () => {
        try {
          const res = await api.get(`/notifications/${auth.user.id}/`);
          setNotifications(res.data.slice(-3));
        } catch (err) {
          console.error("Error fetching notifications:", err);
          setNotifications([]);
        }
      };

      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000);
      return () => clearInterval(interval);
    }
  }, [auth]);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-white font-bold text-xl hover:text-blue-200 transition duration-300">
                Flight Booking
              </Link>
              {auth.user?.role === "CLIENT" && (
                <Link to="/history" className="text-white hover:text-blue-200 transition duration-300">
                  My Bookings
                </Link>
              )}
              {auth.user?.role === "ADMIN" && (
                <Link to="/admin" className="text-white hover:text-blue-200 transition duration-300">
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {auth.user ? (
                <>
                  <span className="text-white">Hello, {auth.user.first_name}</span>
                  {auth.user.role === "CLIENT" && (
                    <button
                      onClick={() => setShowNotifications(true)}
                      className="relative text-white hover:text-blue-200 transition duration-300"
                    >
                      🔔
                      {notifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-blue-200 transition duration-300">
                    Login
                  </Link>
                  <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showNotifications && (
        <Notifications
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default Navbar;