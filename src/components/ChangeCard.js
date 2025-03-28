import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards";
// import Cards from "react-credit-cards-2";
// import "react-credit-cards-2/dist/es/styles-compiled.css";
import "react-credit-cards/es/styles-compiled.css";

import { API_URL, BASE_URL } from "../global/Constant";
import apiFunctions from "../global/GlobalFunction";
import axios from "axios";
import Toast from "../Hooks/Toast";

const ChangeCard = ({ currentView }) => {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    maskedNumber: "",
    previewNumber: "",
    name: "",
    expiry: "",
    brand: "",
    focus: "",
  });

  const getPreviewNumber = (brand, last4) => {
    const brandPrefixes = {
      visa: "411111111111",
      mastercard: "550000000000",
      amex: "340000000000",
      discover: "601100000000",
      "diners club": "300000000000",
    };

    const prefix = brandPrefixes[brand?.toLowerCase()] || "411111111111";
    return `${prefix}${last4}`;
  };

  const getIssuer = (brand) => {
    if (!brand) return undefined;
    if (brand === "American Express") return "amex";
    if (brand === "Diners Club") return "dinersclub";
    return brand.toLowerCase();
  };

  useEffect(() => {
    if (currentView === "manage card") {
      const request = axios.CancelToken.source();

      getStripeCardDetails(request);
      return () => request.cancel(); // (*)
    }
  }, [currentView]);

  const getStripeCardDetails = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_STRIPE_CARD_DETAILS,
        request
      );

      if (res.status === 200 && res.data?.cards?.length > 0) {
        const card = res.data.cards[0];
        const formattedExpiry = `${card.exp_month
          .toString()
          .padStart(2, "0")}/${card.exp_year.toString().slice(-2)}`;

        setCardData({
          maskedNumber: `**** **** **** ${card.last4}`,
          //   previewNumber: getPreviewNumber(card.brand, card.last4),
          name: card.name,
          expiry: formattedExpiry,
          brand: card.brand,
          last4: card.last4, // <-- ADD THIS LINE
          focus: "",
        });
      } else {
        const errorToast = new Toast(
          res.response?.data?.message || "Unable to fetch card details",
          "error",
          res.response?.status || 400
        );
        errorToast.show();
      }
    } catch (error) {
      const errorToast = new Toast("Internal Server Error", "error", 500);
      errorToast.show();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Your Saved Card
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        This is your current card on file.
      </p>

      <div className="mb-6">
        <Cards
          //   number={cardData.previewNumber}
          name={cardData.name}
          expiry={cardData.expiry}
          focused={cardData.focus}
          //   issuer={getIssuer(cardData.brand)}
          number={`**** **** **** ${cardData?.last4}`}
          issuer={
            cardData?.brand === "American Express"
              ? "amex"
              : cardData?.brand === "Diners Club"
              ? "dinersclub"
              : cardData?.brand?.toLowerCase()
          }
          preview={true}
        />
      </div>

      <form className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="number"
          placeholder="Card Number"
          value={cardData.maskedNumber}
          disabled
          className="bg-gray-100 text-gray-700 border border-gray-300 p-3 rounded-md cursor-not-allowed"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Cardholder Name"
            value={cardData.name}
            disabled
            className="bg-gray-100 text-gray-700 border border-gray-300 p-3 rounded-md cursor-not-allowed"
          />
          <input
            type="tel"
            name="expiry"
            placeholder="MM/YY"
            value={cardData.expiry}
            disabled
            className="bg-gray-100 text-gray-700 border border-gray-300 p-3 rounded-md cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#7F31FB] text-white font-semibold py-3 rounded-md hover:bg-[#6a25d1] transition"
        >
          Change Card
        </button>
      </form>
    </div>
  );
};

export default ChangeCard;
