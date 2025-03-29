import React from "react";
import UpdateCardForm from "../../stripe/UpdateCardForm";

const UpdateCardModal = ({ show, onHide, setRefreshData }) => {
  if (!show) return null; // Prevents rendering if modal is not shown

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onHide}
      ></div>

      {/* Modal content */}
      <div className="relative bg-[#ffffff] text-black p-6 rounded-xl shadow-lg w-96">
        {/* Close button (cross icon) */}
        <button
          onClick={onHide}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <UpdateCardForm onHide={onHide} setRefreshData={setRefreshData} />
      </div>
    </div>
  );
};

export default UpdateCardModal;
