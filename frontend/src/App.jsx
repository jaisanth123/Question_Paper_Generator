import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PdfUploader from "./components/pdf/PdfUploader";
import Proctor from "./components/proctoring/Proctor";
import Test from "./components/proctoring/test";
import Profile from "./components/utils/Profile";
import Quiz from "./components/Quiz";

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
        {isAuthenticated && <NavBar />}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<QuestionPaperGenerator />} />
              <Route path="/upload" element={<PdfUploader />} />
              <Route path="/about" element={<div>About Page</div>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/proctor" element={<Proctor />} />
              <Route path="/test" element={<Test />} />
              <Route path="*" element={<div>404 Not Found</div>} />
              <Route path="/quiz" element={<Quiz/>} />
            </>
          ) : (
            <>
              <Route
                path="/signin"
                element={<SignIn onLogin={handleLogin} />}
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<SignIn onLogin={handleLogin} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
