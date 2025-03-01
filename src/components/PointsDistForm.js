import { useEffect, useState } from "react";
import React from "react";
import Toast from "../Hooks/Toast";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";

const PointsDistForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [points, setPoints] = useState("");
  const [carryForward, setCarryForward] = useState(true); // Default is "Not Carry Forward"

  useEffect(() => {
    // Retrieve company name from localStorage
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }
  }, []);

  const handlePointsDistribute = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button
    const data = {
      points: parseInt(points),
      carryForward: carryForward,
    };

    try {
      let pointsDistributeResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.POINTS_DISTRIBUTE_BY_COMPANY_ID,
        data
      );
      if (
        pointsDistributeResponse.status === 201 ||
        pointsDistributeResponse.status === 200
      ) {
        const successToast = new Toast(
          pointsDistributeResponse.data.message,
          "success",
          pointsDistributeResponse.status
        );
        successToast.show();

        setPoints("");
      } else {
        const successToast = new Toast(
          pointsDistributeResponse.response.data.message,
          "error",
          pointsDistributeResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      setIsSubmitting(false);
    }
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
            onChange={(e) => setPoints(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter points"
          />
        </div>

        {/* Radio Buttons for Carry Forward Selection */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="carryForward"
              value="carryForward"
              checked={carryForward === true}
              onChange={() => setCarryForward(true)}
              className="w-4 h-4 text-indigo-600 border-gray-200 focus:ring-indigo-500"
            />
            <span className="text-gray-700 text-sm font-medium">
              Carry Forward
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="carryForward"
              value="notCarryForward"
              checked={carryForward === false}
              onChange={() => setCarryForward(false)}
              className="w-4 h-4 text-indigo-600 border-gray-200 focus:ring-indigo-500"
            />
            <span className="text-gray-700 text-sm font-medium">
              Not Carry Forward
            </span>
          </label>
        </div>

        <button
          onClick={handlePointsDistribute}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PointsDistForm;
