import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./UpdateCardForm.css";
import Toast from "../Hooks/Toast";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";

const stripePromise = loadStripe(
  "pk_test_51Qt39J05uvznrjSmkPQwJAOwcdCwVfzQbXJHbzdLq816kNkxQpqrXPaNFLkmxEnKeJf4KW8snvX0JhrKUH5gbafJ003zudp8it"
);

const CheckoutForm = ({ onHide, setRefreshData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateCard = async (cardToken) => {
    // e.preventDefault();
    setLoading(true);
    let updateCardBody = {
      token: cardToken,
    };
    // console.log(signUpBody, "signUpBody");
    try {
      // Set loading to true to disable further clicks
      setLoading(true);
      let updateCardResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.UPDATE_STRIPE_CARD,
        updateCardBody
      );
      //console.log(signUpResponse.data.data.roleId, "signUpResponse");
      if (
        updateCardResponse.status === 201 ||
        updateCardResponse.status === 200
      ) {
        const successToast = new Toast(
          updateCardResponse.data.message,
          "success",
          updateCardResponse.status
        );
        successToast.show();
        onHide();
        setRefreshData((prev) => !prev);
        //localStorage.setItem("token", loginDealerResponse.data.token);
      } else {
        const successToast = new Toast(
          updateCardResponse.response.data.message,
          "error",
          updateCardResponse.response.status
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isButtonDisabled) return;

    if (cardHolderName?.trim()?.length < 1) {
      const successToast = new Toast(
        "Card holder name can't be empty",
        "error",
        400
      );
      successToast.show();
      return;
    }

    if (cardHolderName?.trim()?.length > 19) {
      const successToast = new Toast(
        "Card holder exceed from maximum threshold",
        "error",
        400
      );
      successToast.show();
      return;
    }

    if (!stripe || !elements) {
      return;
    }
    setIsButtonDisabled(true);

    const cardNumberElement = elements.getElement(CardNumberElement);
    // const cardholderName1 = document.getElementById('cardholder-name').value;
    const { token, error } = await stripe.createToken(cardNumberElement, {
      name: document.getElementById("cardholder-name").value,
    });
    if (error) {
      const successToast = new Toast(error?.message, "error", 400);
      successToast.show();
      return;
    }

    if (token) {
      // console.log("Received Token:", token.id);

      // Call the modal submit function with token
      handleUpdateCard(token.id);

      elements.getElement(CardNumberElement).clear();
      elements.getElement(CardExpiryElement).clear();
      elements.getElement(CardCvcElement).clear();
      setCardHolderName("");

      setIsButtonDisabled(false); // Enable button again after response is received
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <label
        htmlFor="cardholder-name"
        className="block text-sm font-medium mb-2"
      >
        Cardholder Name
      </label>
      <input
        id="cardholder-name"
        className="w-full px-3 py-1  border border-[#808080]/20 rounded-lg text-[#000000] placeholder-[#9996AA] focus:outline-none focus:ring-1 focus:ring-[#808080] focus:border-transparent"
        type="text"
        placeholder="Enter your cardholder name"
        value={cardHolderName}
        onChange={(e) => setCardHolderName(e.target.value)}
        required
      />

      <label className="block text-sm font-medium mb-2">
        Cardholder Number
      </label>
      <div className="p-2 border border-gray-300 rounded-md">
        <CardNumberElement className="w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date</label>
          <div className="p-2 border border-gray-300 rounded-md">
            <CardExpiryElement className="w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CVC</label>
          <div className="p-2 border border-gray-300 rounded-md">
            <CardCvcElement className="w-full" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        id="card-button"
        disabled={isButtonDisabled}
        className={`w-full bg-gradient-to-r from-[#FC36FF] to-[#7F31FB] text-[#FFFFFF] py-3  px-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center${
          isButtonDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        style={{
          fontFamily: "sans-serif",
          textTransform: "capitalize",
          fontWeight: "lighter",
          borderRadius: "50px",
          marginTop: "30px",
        }}
      >
        Save Your Card
      </button>
    </form>
  );
};

const UpdateCardForm = ({ onHide, setRefreshData }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onHide={onHide} setRefreshData={setRefreshData} />
  </Elements>
);

export default UpdateCardForm;
