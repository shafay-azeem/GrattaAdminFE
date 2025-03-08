import React, { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../global/Constant";
import apiFunctions from "../global/GlobalFunction";
import axios from "axios";
import Toast from "../Hooks/Toast";

const PointsAvailable = ({ currentView }) => {
  const [loading, setLoading] = useState(false);
  const [receivedUserTransfers, setReceivedUserTransfers] = useState([]);
  const [personalPoints, setPersonalPoints] = useState(0);

  const [rewards] = useState([
    {
      id: 1,
      name: "Amazon Gift Card",
      points: 1000,
      image: "/amazon-card.jpg",
      description: "Redeem for shopping on Amazon",
      date: "2025-01-10",
      redeemed: true,
    },
    {
      id: 2,
      name: "Starbucks Gift Card",
      points: 500,
      image: "/starbucks-card.jpg",
      description: "Get your favorite coffee",
    },
    {
      id: 3,
      name: "Target Gift Card",
      points: 750,
      image: "/target-card.jpg",
      description: "Shop at Target stores",
    },
    {
      id: 4,
      name: "Extra PTO Day",
      points: 2000,
      image: "/pto-day.jpg",
      description: "Take an extra day off",
    },
  ]);

  useEffect(() => {
    if (currentView === "transactions") {
      const request = axios.CancelToken.source();

      getReceivedUserTransfers(request);
      return () => request.cancel(); // (*)
    }
  }, [currentView]);

  const getReceivedUserTransfers = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const getReceivedUserTransfersResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_RECEIVED_USER_TRANSFERS,
        request
      );
      if (getReceivedUserTransfersResponse.status === 200) {
        setPersonalPoints(
          getReceivedUserTransfersResponse?.data?.personalPoints || 0
        );
        setReceivedUserTransfers(
          getReceivedUserTransfersResponse?.data?.transactions || []
        );
        setLoading(false);
      } else {
        if (axios.isCancel(getReceivedUserTransfersResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getReceivedUserTransfersResponse.response.data.message,
            "error",
            getReceivedUserTransfersResponse.response.status
          );
          successToast.show();
        }
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      // Set loading to false to re-enable button after the request is done
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <p className="text-gray-500 text-lg font-medium">Loading...</p>
          </div>
        ) : receivedUserTransfers.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Points Transactions</h2>
              <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <span className="text-indigo-600 font-semibold">
                  {personalPoints} Points Available
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {receivedUserTransfers.map((transfer) => (
                <div key={transfer._id} className="border-b pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span>Received from</span>
                      <div className="bg-blue-50 px-2 py-1 rounded-md">
                        <p className="font-medium text-blue-600">
                          {transfer.sender.name}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {transfer.points} points
                      </span>

                      <p className="text-xs text-gray-500">
                        {formatDate(transfer.createdAt)}
                      </p>
                    </div>
                    {transfer.note && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-600 break-words">
                          {transfer.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-6">
            No transactions found.
          </p>
        )}
      </div>
    </>
  );
};

export default PointsAvailable;
