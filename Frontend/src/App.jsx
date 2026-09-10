
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import ExpensePage from "./pages/ExpensePage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ExpensePage />} />
      </Routes>
    </>
  );
};

export default App;