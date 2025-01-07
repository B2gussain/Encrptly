import "./App.css";
import Home from "./pages/Home"
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
    <div> <Routes>
    <Route path="/Home" element={<Home />} />
    <Route path="/Login" element={<Login />} />
  </Routes></div>
  </>
  );
}

export default App;
