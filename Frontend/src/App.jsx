import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import ExpensePage from "./pages/ExpensePage";
import ResetPassword from "./pages/ResetPassword";
import ExpenseReport from "./pages/ExpenseReport";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ExpensePage />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
        <Route path="/expense-report" element={<ExpenseReport />} />
      </Routes>
    </>
  );
};

export default App;
