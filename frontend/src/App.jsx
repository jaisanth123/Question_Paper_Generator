import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import PdfUploader from "./components/pdf/PdfUploader";
import Proctor from "./components/proctoring/Proctor";
import Test from "./components/proctoring/test";
import Profile from "./components/utils/Profile";
import "@babel/polyfill";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

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
    <div className="bg-white text-black min-h-screen">
      {isAuthenticated && location.pathname !== "/test" && <NavBar />}
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
          </>
        ) : (
          <>
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<SignIn onLogin={handleLogin} />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
