import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PdfUploader from "./components/pdf/PdfUploader";
import Proctor from "./components/proctoring/Proctor";
import Test from "./components/proctoring/test";
import Profile from "./components/utils/Profile";
import Quiz from "./components/Quiz";
import History from "./components/utils/History";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const checkAuth = () => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[0] || token));
        if (decodedToken.exp > Date.now()) {
          setIsAuthenticated(true);
          return;
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
      // Token expired or invalid
      sessionStorage.removeItem("jwtToken");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // Re-check auth when location changes
    // This helps with logout redirect
  }, [location.pathname]);

  return (
    <div className="bg-white text-black min-h-screen">
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <QuestionPaperGenerator />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/upload"
          element={
            isAuthenticated ? <PdfUploader /> : <Navigate to="/signin" />
          }
        />
        <Route
          path="/about"
          element={
            isAuthenticated ? <div>About Page</div> : <Navigate to="/signin" />
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/signin" />}
        />
        <Route
          path="/proctor"
          element={isAuthenticated ? <Proctor /> : <Navigate to="/signin" />}
        />
        <Route
          path="/test"
          element={isAuthenticated ? <Test /> : <Navigate to="/signin" />}
        />
        <Route
          path="/quiz"
          element={isAuthenticated ? <Quiz /> : <Navigate to="/signin" />}
        />
        <Route
          path="/history"
          element={isAuthenticated ? <History /> : <Navigate to="/signin" />}
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <div>404 Not Found</div>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
