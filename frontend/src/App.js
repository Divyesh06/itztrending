import logo from "./logo.svg";
import React, { useContext, useState, useEffect } from "react";
import "./index.css";
import Trends from "./Components/Trends";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet

} from "react-router-dom";
import TrendPage from "./Components/TrendPage";
import { TrendProvider, TrendContext } from "./Context/TrendProvider"; // Import both the Provider and Context
import { check_auth } from "./auth_apis";
import Authenticate from "./Components/AuthenticateForm";
import SetProfile from "./Components/SetProfile";
import ResetPassword from "./Components/ResetPassword";
import VerifyOtp from "./Components/VerifyOtp";
import CreatePoll from "./Components/CreatePoll";
import Polls from "./Components/Polls";
import { ToastContainer, toast } from 'react-toastify';
function App() {
  const [loggedin, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // To handle async calls

  // Check authentication when the app starts
  useEffect(() => {
    async function authChecking() {
      try {
        const [initAuth_success, initAuth_response] = await check_auth();
        if (initAuth_success) {
          if (initAuth_response.user._id) {
            console.log(initAuth_response);
            setLoggedIn(true);
          } else {
            console.log(initAuth_response);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    authChecking();
  }, []); // Empty dependency array ensures it runs only once

  function ProtectedRoute({ children }) {
    if (loading) {
      return <div>Loading...</div>; // Show a loader while checking auth
    }
    return loggedin ? children : <Navigate to="/signup" />;
  }

  return (
    <TrendProvider>
      <ToastContainer position="top-right"/>  
      <Router>
        <Routes>
          <Route path="/" element={<Trends />} />
          <Route path="/login" element={<Authenticate mode="login" />} />
          <Route path="/signup" element={<Authenticate mode="signup" />} />
          <Route path="/profile-edit" element={<SetProfile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              path="/trend/:id"
              element={<TrendPage key={window.location.pathname} />}
            />
            <Route path="/polls" element={<Polls />} />
            <Route path="/polls/:trend_id" element={<Polls />} />
          </Route>

        </Routes>
      </Router>
    </TrendProvider>
  );
}

export default App;
