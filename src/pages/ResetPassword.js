import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import Toast from "../Hooks/Toast";
import { toast } from "react-toastify";

function ResetPassword() {
  const { id } = useParams();
  const location = useLocation();

  console.log(location.pathname, "location.pathname");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast("Passwords do not match", {
        position: "top-center",
        type: "error",
        autoClose: 3000,
        theme: "dark",
      });
      setLoading(false); // Ensure loading is stopped when validation fails
      return;
    }
    let resetPasswordBody = {
      password: password,
      confirmPassword: confirmPassword,
    };
    try {
      let response;

      if (location.pathname.toLowerCase().includes("/setpassword")) {
        // "Accept Invitation" API Call
        response = await apiFunctions.PUT_REQUEST(
          BASE_URL + API_URL.ACCEPT_INVITATION + id,
          resetPasswordBody
        );
      } else {
        // "Reset Password" API Call
        response = await apiFunctions.PUT_REQUEST(
          BASE_URL + API_URL.RESET_PASSWORD + id,
          resetPasswordBody
        );
      }

      if (response.status === 201 || response.status === 200) {
        const successToast = new Toast(
          response.data.message,
          "success",
          response.status
        );
        successToast.show();
        navigate("/loginpage");
      } else {
        const successToast = new Toast(
          response.response.data.message,
          "error",
          response.response.status
        );
        successToast.show();
      }
    } catch (error) {
      // console.log(error);
      const successToast = new Toast("Internal Server Error", "error", 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0533] to-[#000000] flex flex-col">
      <nav className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <a href="/">
                <img
                  src="https://ucarecdn.com/e65937ae-5fea-4158-9bde-d5b039e3b211/-/format/auto/"
                  alt="Grattia logo"
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] rounded-full filter blur-3xl opacity-20"></div>
            <div className="relative">
              <h2 className="text-center text-4xl font-bold text-[#FFFFFF] mb-8">
                Set New Password
              </h2>
              <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm border border-[#7AFBF7]/20">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[#FFFFFF] text-sm font-medium mb-2"
                      >
                        New password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                        placeholder="Enter your password"
                      />

                      <label
                        htmlFor="email"
                        className="block text-[#FFFFFF] text-sm font-medium mb-2 mt-2 "
                      >
                        Confirm password
                      </label>
                      <input
                        id="password2"
                        name="password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] py-3 px-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <i className="fas fa-circle-notch fa-spin"></i>
                      ) : (
                        "Confirm Pasword"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-[#7AFBF7] text-4xl mb-4">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <h3 className="text-[#FFFFFF] text-xl font-semibold">
                      Password Reset SuccessFully
                    </h3>
                    {/* <p className="text-[#9996AA]">
                        We've sent password reset instructions to enter email
                      </p> */}
                  </div>
                )}
                <div className="mt-6 text-center">
                  <a
                    href="/loginpage"
                    className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors"
                  >
                    Back to Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t border-[#7AFBF7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-[#9996AA]">
              © 2025 Grattia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ResetPassword;
