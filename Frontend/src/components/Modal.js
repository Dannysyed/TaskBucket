import React from "react";

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
