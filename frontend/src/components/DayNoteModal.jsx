// frontend/src/components/DayNoteModal.jsx
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayNoteForm from '../forms/DayNoteForm';
import useOutsideClick from '../hooks/useOutsideClick';

const DayNoteModal = ({ isOpen, onClose, onSubmit, dayNoteToEdit }) => {
  const formRef = useRef(null);
  const modalContentRef = useRef(null);

  useOutsideClick(modalContentRef, onClose, isOpen);

  // Converte a nota vinda do backend (noteContent) para o formato que o form espera (noteText)
  const transformEditNoteForForm = (note) => {
    if (!note) return null;
    // mantemos noteDate e convertemos noteContent para noteText para o DayNoteForm
    return {
      ...note,
      noteText: note.noteContent ?? '',
    };
  };

  const handleSubmit = (data) => {
    const formatted = {
      ...data,
      // data.noteDate vem como Date do DatePicker — convertemos para dd/MM/yyyy
      noteDate: data.noteDate ? data.noteDate.toLocaleDateString('pt-BR') : null,
    };
    onSubmit(formatted);
  };

  // Prepara prop para o form (DayNoteForm espera dayNoteToEdit.noteText)
  const formDayNoteToEdit = transformEditNoteForForm(dayNoteToEdit);

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
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <header className="flex justify-between items-center mb-6 flex-shrink-0">
              <h2 className="text-md font-semibold text-gray-700 uppercase">
                {formDayNoteToEdit ? 'Editar Nota do Dia' : 'Cadastrar Nota do Dia'}
              </h2>
              <button
                onClick={onClose}
                className="btn-close text-gray-500 hover:text-gray-700 text-3xl font-light"
                aria-label="Fechar modal"
              >
                &times;
              </button>
            </header>

            <div className="flex-grow overflow-y-auto pr-2 scrollbar">
              <DayNoteForm
                onSubmit={handleSubmit}
                ref={formRef}
                dayNoteToEdit={formDayNoteToEdit}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
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
                Salvar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayNoteModal;
