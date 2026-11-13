	// frontend/src/components/DayCoffeeModal.jsx
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayCoffeeForm from '../forms/DayCoffeeForm';
import useOutsideClick from '../hooks/useOutsideClick'; // ⬅ Importando o hook

const DayCoffeeModal = ({
  isOpen,
  onClose,
  coffees,
  onSubmit,
  onUpdate,
  dayCoffeeToEdit
}) => {
  const formRef = useRef(null);
  const modalContentRef = useRef(null);

  // ⬅ Hook em ação!
  useOutsideClick(modalContentRef, onClose, isOpen);

  const isEditing = Boolean(dayCoffeeToEdit);
  const title = isEditing ? 'Editar Café do Dia' : 'Cadastrar Café do Dia';
  const actionLabel = isEditing ? 'Salvar Alterações' : 'Cadastrar';

  const handleSubmit = (data) => {
    const formatted = {
      ...data,
      dayDate: data.dayDate ? data.dayDate.toLocaleDateString('pt-BR') : null,
    };

    if (isEditing) {
      onUpdate({ ...formatted, dayCoffeeId: dayCoffeeToEdit.dayCoffeeId });
    } else {
      onSubmit(formatted);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4"
        >
          <motion.div
						ref={modalContentRef}
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 flex flex-col max-h-[90vh]"
          >
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-md font-semibold text-gray-700 uppercase">{title}</h2>
              <button
                onClick={onClose}
                className="btn-close text-gray-500 hover:text-gray-700 text-3xl font-light"
              >
                &times;
              </button>
            </header>

            <div className="flex-grow overflow-y-auto pr-2 scrollbar">
              <DayCoffeeForm
                coffees={coffees}
                onSubmit={handleSubmit}
                ref={formRef}
                dayCoffeeToEdit={dayCoffeeToEdit}
              />
            </div>

            <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => formRef.current?.submit()}
                className="px-5 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                {actionLabel}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayCoffeeModal;
