import React, { useEffect, useState } from "react";
import axios from "axios";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import Toast from "../Hooks/Toast";

const CompActivityCard = () => {
  const [companyActivity, setCompanyActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const request = axios.CancelToken.source();

    getCompanyTransactions(request);
    return () => request.cancel(); // (*)
  }, []);

  const getCompanyTransactions = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const getCompanyTransactionsResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_COMPANY_TRANSACTIONS,
        request
      );
      if (getCompanyTransactionsResponse.status === 200) {
        setCompanyActivity(getCompanyTransactionsResponse?.data?.transactions);
        setLoading(false);
      } else {
        if (axios.isCancel(getCompanyTransactionsResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getCompanyTransactionsResponse.response.data.message,
            "error",
            getCompanyTransactionsResponse.response.status
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
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6">Company Activity</h2>
          <div className="space-y-4">
            {companyActivity.length > 0 ? (
              companyActivity?.map((activity) => (
                <div key={activity._id} className="border-b pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-50 px-2 py-1 rounded-md">
                        <p className="font-medium text-blue-600">
                          {activity.receiver.name}
                        </p>
                      </div>
                      <span className="text-gray-400">from</span>
                      <div className="bg-blue-50 px-2 py-1 rounded-md">
                        <p className="font-medium text-blue-600">
                          {activity.sender.name}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {activity.points} points
                      </span>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                    {activity?.type === "company_allocation" ? null : (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-600 break-words">
                          {activity.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No transactions found
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CompActivityCard;
