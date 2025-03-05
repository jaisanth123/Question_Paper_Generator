// frontend/src/App.jsx
import { useState } from "react";
import NavBar from "./components/NavBar";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import UserActivityTracker from "./components/UserActivityTracker";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full min-h-screen">
      <NavBar />
      <UserActivityTracker /> {/* Add the UserActivityTracker component here */}
      <QuestionPaperGenerator />
    </div>
  );
}

export default App;
