import { useState } from "react";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import { useNavigate } from "react-router-dom";
import Toast from "../Hooks/Toast.js";
import AddCardModal from "../components/Modals/AddCardModal";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const handleModalSubmit = async (cardToken) => {
    // e.preventDefault();
    setLoading(true);
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }
    let signUpBody = {
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      email: email,
      password: password,
      cardToken: cardToken, // Include card token in request
    };
    // console.log(signUpBody, "signUpBody");
    try {
      // Set loading to true to disable further clicks
      setLoading(true);
      let signUpResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.SIGNUP,
        signUpBody
      );
      //console.log(signUpResponse.data.data.roleId, "signUpResponse");
      if (signUpResponse.status === 201 || signUpResponse.status === 200) {
        const successToast = new Toast(
          signUpResponse.data.message,
          "success",
          signUpResponse.status
        );
        successToast.show();
        navigate("/loginpage");
        //localStorage.setItem("token", loginDealerResponse.data.token);
      } else {
        const successToast = new Toast(
          signUpResponse.response.data.message,
          "error",
          signUpResponse.response.status
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

  // Handle form submission (Opens modal instead of API request)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Open the modal
    setModalShow(true);
  };

  return (
    <>
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
                  Create your account
                </h2>
                <div className="bg-[#0F0533] bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm border border-[#7AFBF7]/20">
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-400 text-red-400 rounded-lg">
                      {error.toString()}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-[#FFFFFF] text-sm font-medium mb-2"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-[#FFFFFF] text-sm font-medium mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-[#FFFFFF] text-sm font-medium mb-2"
                      >
                        Company Name
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-[#FFFFFF] placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                        placeholder="Enter your company name"
                      />
                    </div>
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
                        placeholder="Create a password"
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
                        "Create Account"
                      )}
                    </button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-[#9996AA]">
                      Already have an account?{" "}
                      <a
                        href="/loginpage"
                        className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors"
                      >
                        Log in
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

      <AddCardModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        loading={loading}
        handleModalSubmit={handleModalSubmit}
        setModalShow={setModalShow}
      />
    </>
  );
};
export default SignUpPage;
