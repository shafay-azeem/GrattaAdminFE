import { useState } from "react";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import { useNavigate } from "react-router-dom";
import Toast from "../Hooks/Toast.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);

    const forgotPasswordBody = {
      email: email,
    };
    try {
      setLoading(true);
      let forgotPasswordResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.FOTGOT_PASSWORD,
        forgotPasswordBody
      );
      if (
        forgotPasswordResponse.status === 201 ||
        forgotPasswordResponse.status === 200
      ) {
        setEmail("");
        const successToast = new Toast(
          forgotPasswordResponse.data.message,
          "success",
          forgotPasswordResponse.status
        );
        successToast.show();
      } else {
        const successToast = new Toast(
          forgotPasswordResponse.response.data.message,
          "error",
          forgotPasswordResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
      // console.log(error);
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
                Reset Password
              </h2>
              <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm border border-[#7AFBF7]/20">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[#FFFFFF] text-sm font-medium mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                        placeholder="Enter your email address"
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
                        "Send Reset Link"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-[#7AFBF7] text-4xl mb-4">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <h3 className="text-[#FFFFFF] text-xl font-semibold">
                      Check Your Email
                    </h3>
                    <p className="text-[#9996AA]">
                      We've sent password reset instructions to {email}
                    </p>
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
};
export default ForgotPassword;
