import { useState } from "react";
import apiFunctions from "./global/GlobalFunction";
import { API_URL, BASE_URL } from "./global/Constant";
import { useNavigate } from "react-router-dom";
import Toast from "./Hooks/Toast.js";
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError("");

    // if (password.length < 8) {
    //   setError("Password must be at least 8 characters long");
    //   setLoading(false);
    //   return;
    // }
    let loginBody = {
      email: email,
      password: password,
    };

    try {
      // Set loading to true to disable further clicks
      setLoading(true);
      let loginResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.SIGNIN,
        loginBody
      );
      if (loginResponse.status === 201 || loginResponse.status === 200) {
        const successToast = new Toast(
          loginResponse.data.message,
          "success",
          loginResponse.status
        );
        successToast.show();
        navigate("/MainApp");
        localStorage.setItem("token", loginResponse.data.token);
        if (loginResponse.data.user) {
          localStorage.setItem("role", loginResponse.data.user.role);
        }
        // Store company name in local storage
        if (loginResponse.data.user && loginResponse.data.user.company) {
          localStorage.setItem(
            "companyName",
            loginResponse.data.user.company.name
          );
        }
      } else {
        const successToast = new Toast(
          loginResponse.response.data.message,
          "error",
          loginResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      // Set loading to false to re-enable button after the request is done
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
                Welcome
              </h2>
              <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm border border-[#7AFBF7]/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#FFFFFF] text-sm font-medium mb-2"
                    >
                      Work Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[#FFFFFF] text-sm font-medium mb-2"
                    >
                      Password
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
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#FC36FF] focus:ring-[#FC36FF] border-[#7AFBF7]/20 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-[#9996AA]"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a
                        href="/forgot-password"
                        className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] py-3 px-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <i className="fas fa-circle-notch fa-spin"></i>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-[#9996AA]">
                    Don't have an account?{" "}
                    <a
                      href="/SignUpPage"
                      className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors"
                    >
                      Sign up
                    </a>
                  </p>
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
export default LoginPage;
