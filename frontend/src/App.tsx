import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Home } from "lucide-react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD

      <Route path="/pro/login" element={<Login />} />
      <Route path="/pro/signup" element={<Signup />} />
=======
>>>>>>> 6b099299fd2a3809712aac74e4f288ffbf58e493
    </Routes>
  );
}

export default App;
