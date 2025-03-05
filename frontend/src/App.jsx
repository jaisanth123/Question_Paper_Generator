import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes instead of Switch
import NavBar from "./components/NavBar";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import UserActivityTracker from "./components/utils/UserActivityTracker";
import SignIn from "./components/auth/SignIn";
import PdfUploader from "./components/pdf/PdfUploader";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token));
      if (decodedToken.exp < Date.now()) {
        sessionStorage.removeItem("jwtToken");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <Router>
      <div className="bg-white text-black min-h-screen">
        <NavBar />
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<QuestionPaperGenerator />} />
            <Route path="/upload" element={<PdfUploader />} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
          </Routes>
        ) : (
          <SignIn onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
