import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Toast from "../Hooks/Toast";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51Qt39J05uvznrjSmkPQwJAOwcdCwVfzQbXJHbzdLq816kNkxQpqrXPaNFLkmxEnKeJf4KW8snvX0JhrKUH5gbafJ003zudp8it"
);

const PaymentForm = () => {
  const storeCompanyId = localStorage.getItem("companyId");
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0); // Store the amount
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [points, setPoints] = useState("");
  const [activeUserCount, setActiveUserCount] = useState();

  useEffect(() => {
    // Retrieve company name from localStorage
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }
  }, []);

  useEffect(() => {
    const request = axios.CancelToken.source();

    getActiveUserCount(request);
    return () => request.cancel(); // (*)
  }, []);

  const getActiveUserCount = async (request) => {
    try {
      const getActiveUserCountResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_ACTIVE_USER_COUNT_BY_COMPANY_ID,
        request
      );

      if (getActiveUserCountResponse.status === 200) {
        console.log(
          getActiveUserCountResponse?.data,
          "getActiveUserCountResponse"
        );
        setActiveUserCount(getActiveUserCountResponse?.data?.activeUserCount);
      } else {
        if (axios.isCancel(getActiveUserCountResponse)) {
          // Handle the cancellation here
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getActiveUserCountResponse.response.data.message,
            "error",
            getActiveUserCountResponse.response.status
          );
          successToast.show();
        }
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    }
  };

  const handlePointsChange = (e) => {
    const enteredPoints = e.target.value;
    setPoints(enteredPoints);

    // // Calculate amount (points * 0.10)
    // const calculatedAmount = enteredPoints
    //   ? (parseFloat(enteredPoints) * 0.1 * activeUserCount).toFixed(2)
    //   : 0;
    // setAmount(calculatedAmount);

    // Calculate amount (points * 0.10 * activeUserCount)
    const parsedPoints = parseFloat(enteredPoints);
    const calculatedAmount =
      !isNaN(parsedPoints) && activeUserCount
        ? (parsedPoints * 0.1 * activeUserCount).toFixed(2)
        : 0;
    setAmount(calculatedAmount);
  };

  // Function to handle payment intent creation
  const handleCreatePaymentIntent = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://gratta-admin-be-2.vercel.app/api/payment/V1/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YThiNzhjN2ZiY2U0ZDhkMDcyZjk3OSIsImlhdCI6MTczOTgyMzcyOSwiZXhwIjoxNzQwMzQyMTI5fQ.mA_6AmZodpgpsFWWYpvuTwnsywPqP9NhnDJudKDZcGM",
          },
          body: JSON.stringify({
            amount,
            companyId: storeCompanyId,
            points,
          }),
        }
      );

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        alert("Error creating payment intent");
      }
    } catch (error) {
      console.error("Payment Intent Error:", error);
    }
    setLoading(false);
  };

  // Function to process the payment
  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    setLoading(true);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardElement },
      }
    );

    if (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed: " + error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("Payment Successful!");
      setPoints("");
      setAmount(0);
      setClientSecret(null);
      elements.getElement(CardElement).clear(); // Clears the card input
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Company Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={companyName} // Set value from state
            className="w-full p-2 border rounded-lg"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points Allocation
          </label>
          <input
            type="number"
            name="pointsAllocation"
            value={points}
            onChange={handlePointsChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter points"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            disabled
            className="w-full p-2 border rounded-lg"
            placeholder="Calculated amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details
          </label>
          <CardElement className="p-2 border rounded-lg" />
        </div>
        <button
          onClick={handleCreatePaymentIntent}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Payment Intent"}
        </button>
        {clientSecret && (
          <button
            onClick={handleSubmitPayment}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition mt-4"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

// Wrap in Stripe Elements
const PaymentPage = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentPage;
