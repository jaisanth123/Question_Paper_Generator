// frontend/src/App.jsx
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import UserActivityTracker from "./components/utils/UserActivityTracker";
import SignIn from "./components/auth/SignIn";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token));
      // Check if the token is expired
      if (decodedToken.exp < Date.now()) {
        sessionStorage.removeItem("jwtToken"); // Remove expired token
      } else {
        setIsAuthenticated(true); // Token is valid
      }
    }
  }, []);

  return (
    <div className="w-full min-h-screen">
      {isAuthenticated ? (
        <>
          <NavBar />
          <UserActivityTracker />
          <QuestionPaperGenerator />
        </>
      ) : (
        <SignIn onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
