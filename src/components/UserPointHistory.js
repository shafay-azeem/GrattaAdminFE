import React, { useEffect, useState } from "react";
import Toast from "../Hooks/Toast";
import { API_URL, BASE_URL } from "../global/Constant";
import apiFunctions from "../global/GlobalFunction";
import axios from "axios";

const UserPointHistory = ({ currentView }) => {
  const [loading, setLoading] = useState(false);
  const [personalActivity, setPersonalActivity] = useState([]);

  useEffect(() => {
    if (currentView === "personal") {
      const request = axios.CancelToken.source();

      getUserPointHistory(request);
      return () => request.cancel(); // (*)
    }
  }, [currentView]);

  const getUserPointHistory = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const userPointHistoryResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_USER_POINT_HISTORY,
        request
      );
      if (userPointHistoryResponse.status === 200) {
        setPersonalActivity(userPointHistoryResponse?.data?.transactions);
        setLoading(false);
      } else {
        if (axios.isCancel(userPointHistoryResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            userPointHistoryResponse.response.data.message,
            "error",
            userPointHistoryResponse.response.status
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
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p className="text-gray-500 text-lg font-medium">Loading...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Your Points History</h2>
          <div className="space-y-4">
            {personalActivity.map((activity) => (
              <div key={activity._id} className="border-b pb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-50 px-2 py-1 rounded-md">
                      <p className="font-medium text-blue-600">
                        {activity.sender.name}
                      </p>
                    </div>
                    <span className="text-gray-400">to</span>

                    <div className="bg-blue-50 px-2 py-1 rounded-md">
                      <p className="font-medium text-blue-600">
                        {activity.receiver.name}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {activity.points} points
                    </span>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                  {activity.note && activity.note.trim() !== "" && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 break-words">
                        {activity.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserPointHistory;
