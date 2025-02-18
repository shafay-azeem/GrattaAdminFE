import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51Qt39J05uvznrjSmkPQwJAOwcdCwVfzQbXJHbzdLq816kNkxQpqrXPaNFLkmxEnKeJf4KW8snvX0JhrKUH5gbafJ003zudp8it"
);

const PaymentForm = ({ companyId, companyName, points }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(""); // Store the amount
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

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
            companyId: "67a8b78c7fbce4d8d072f977",
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
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Company Payment</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter amount"
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
