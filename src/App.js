import "./App.css";
import LandingPage from "./LandingPage.js";
import LoginPage from "./pages/LoginPage.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import SignUpPage from "./pages/SignUpPage.js";
import GrattaAdmin from "./GrattaAdmin.js";
import ResetPassword from "./pages/ResetPassword.js";
import MainApp from "./pages/MainApp.js";
import { Route, Routes } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/SignUpPage" element={<SignUpPage />} />
      <Route path="/GrattaAdmin" element={<GrattaAdmin />} />
      <Route path="/ResetPassword/:id" element={<ResetPassword />} />
      <Route path="/setPassword/:id" element={<ResetPassword />} />

      <Route path="/MainApp" element={<MainApp />} />
    </Routes>
  );
}

export default App;
