// frontend/src/components/ConfirmationModal.jsx
import React, { useRef } from 'react';
import useOutsideClick from '../hooks/useOutsideClick';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const contentRef = useRef(null);
  useOutsideClick(contentRef, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-[10000]">
      <div
        ref={contentRef}
        className="relative p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
