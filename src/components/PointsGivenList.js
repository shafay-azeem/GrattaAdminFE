import React, { useEffect, useState } from "react";
import axios from "axios";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import Toast from "../Hooks/Toast";

const PointsGivenList = ({ setRefreshData, refreshData }) => {
  const [editNote, setEditNote] = useState("");

  const [editingActivity, setEditingActivity] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pointsGivenList, setPointsGivenList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateRefreshData, setUpdateRefreshData] = useState(false); // State to trigger API call

  useEffect(() => {
    const request = axios.CancelToken.source();

    getPointsGivenLastHour(request);
    return () => request.cancel(); // (*)
  }, [refreshData, updateRefreshData]);

  const getPointsGivenLastHour = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const getPointsGivenLastHourResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_POINTS_GIVEN_LAST_HOUR,
        request
      );
      if (getPointsGivenLastHourResponse.status === 200) {
        setPointsGivenList(getPointsGivenLastHourResponse?.data?.transactions);
        setLoading(false);
      } else {
        if (axios.isCancel(getPointsGivenLastHourResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getPointsGivenLastHourResponse.response.data.message,
            "error",
            getPointsGivenLastHourResponse.response.status
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

  const handleeditNote = async (activity) => {
    setEditingActivity(activity);
    setEditNote(activity.note);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleUndoPoints = async (id) => {
    // setCompanyActivity(companyActivity.filter((a) => a.id !== activity.id));
    // setPointsToGive((prev) => prev + activity.points);

    const body = {
      transactionId: id,
    };

    try {
      let revertTransactionResponse = await apiFunctions.PUT_REQUEST(
        BASE_URL + API_URL.REVERT_TRANSACTION,
        body
      );
      if (
        revertTransactionResponse.status === 201 ||
        revertTransactionResponse.status === 200
      ) {
        const successToast = new Toast(
          revertTransactionResponse.data.message,
          "success",
          revertTransactionResponse.status
        );
        successToast.show();
        setUpdateRefreshData((prev) => !prev);
        setRefreshData((prev) => !prev);
      } else {
        const successToast = new Toast(
          revertTransactionResponse.response.data.message,
          "error",
          revertTransactionResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      // setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (data) => {
    setIsSubmitting(true);

    const body = {
      transactionId: data._id,
      note: editNote,
    };

    try {
      let updateTransactionResponse = await apiFunctions.PUT_REQUEST(
        BASE_URL + API_URL.UPDATE_TRANSACTION_NOTE,
        body
      );
      if (
        updateTransactionResponse.status === 201 ||
        updateTransactionResponse.status === 200
      ) {
        const successToast = new Toast(
          updateTransactionResponse.data.message,
          "success",
          updateTransactionResponse.status
        );
        successToast.show();

        setEditingActivity(null);
        setEditNote("");
        setUpdateRefreshData((prev) => !prev);
      } else {
        const successToast = new Toast(
          updateTransactionResponse.response.data.message,
          "error",
          updateTransactionResponse.response.status
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

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setEditNote("");
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p className="text-gray-500 text-lg font-medium">Loading...</p>
        </div>
      ) : pointsGivenList.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">Points Given</h2>
          <div className="space-y-4">
            {pointsGivenList.map((x) => (
              <div key={x._id} className="border-b pb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-50 px-2 py-1 rounded-md">
                      <p className="font-medium text-blue-600">
                        {x.receiver.name}
                      </p>
                    </div>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                      {x.points} points
                    </span>
                    <p className="text-xs text-gray-500">
                      {formatDate(x.createdAt)}
                    </p>
                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={() => handleeditNote(x)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleUndoPoints(x._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Undo points"
                      >
                        <i className="fas fa-undo"></i>
                      </button>
                    </div>
                  </div>
                  {editingActivity?._id === x._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleSaveEdit(x)}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 break-words">{x.note}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center mt-6">No transactions found.</p>
      )}
    </div>
  );
};

export default PointsGivenList;
