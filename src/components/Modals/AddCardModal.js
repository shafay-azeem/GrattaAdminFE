import React from "react";
import AddCardForm from "../../stripe/AddCardForm";

const AddCardModal = ({ show, onHide, handleModalSubmit, loading }) => {
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
        <AddCardForm handleModalSubmit={handleModalSubmit} />
      </div>
    </div>
  );
};

export default AddCardModal;
