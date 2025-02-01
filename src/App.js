import logo from './logo.svg';
import './App.css';
import LandingPage from "./LandingPage.js";
import LoginPage from "./LoginPage.js";
import ForgotPassword from "./ForgotPassword.js";
import SignUpPage from "./SignUpPage.js";
import GrattaAdmin from "./GrattaAdmin.js";
import ResetPassword from "./ResetPassword.js";
import MainApp from "./MainApp.js";
import { Route, Routes } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/loginpage" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/SignUpPage" element={<SignUpPage />} />
    <Route path="/GrattaAdmin" element={<GrattaAdmin />} />
    <Route path="/ResetPassword/:id" element={<ResetPassword />} />
    <Route path="/MainApp" element={<MainApp />} />
  </Routes>
  
  );
}

export default App;
