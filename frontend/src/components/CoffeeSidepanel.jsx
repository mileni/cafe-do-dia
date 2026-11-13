import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoffeeForm from '../forms/CoffeeForm';
import CoffeeList from './CoffeeList';
import { CgArrowLeft } from "react-icons/cg";
import { LuTrash2 } from "react-icons/lu";
import toast from 'react-hot-toast';  // Certifique-se de importar o toast

const CoffeeSidepanel = ({ isOpen, onClose, onSubmit, coffees, onDeleteCoffee, onUpdateCoffee }) => {
  const formRef = useRef(null);
  const sidepanelContentRef = useRef(null);

  const [currentView, setCurrentView] = useState('list');
  const [selectedCoffee, setSelectedCoffee] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentView('list');
      setSelectedCoffee(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
        setCurrentView('list');
        setSelectedCoffee(null);
      }
    };

    const handleClickOutside = (event) => {
      if (sidepanelContentRef.current && !sidepanelContentRef.current.contains(event.target)) {
        onClose();
        setCurrentView('list');
        setSelectedCoffee(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelectCoffee = (coffee) => {
    setSelectedCoffee(coffee);
    setCurrentView('edit');
  };

  const handleCadastrarNovoClick = () => {
    setSelectedCoffee(null);
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setSelectedCoffee(null);
    setCurrentView('list');
  };

  const handleFormSubmit = async (data) => {
    if (currentView === 'create') {
      await onSubmit(data);
    } else if (currentView === 'edit' && selectedCoffee) {
      await onUpdateCoffee({ ...data, coffeeId: selectedCoffee.coffeeId });
    }
    setSelectedCoffee(null);
    setCurrentView('list');
  };

  // Excluir café diretamente e exibir o toast de confirmação
  const handleDeleteClick = async () => {
    if (selectedCoffee) {
      try {
        await onDeleteCoffee(selectedCoffee.coffeeId);  // Deleta o café

        // Atualiza a lista localmente
        const updatedCoffees = coffees.filter(coffee => coffee.coffeeId !== selectedCoffee.coffeeId);
        onClose(updatedCoffees);  // Atualiza o estado no componente pai

        // Exibe o toast de confirmação
        toast.success(`Café "${selectedCoffee.coffeeName}" excluído com sucesso!`, {
          position: 'bottom-right',
          duration: 5000
        });

        // Limpa a seleção e retorna à lista de cafés
        setSelectedCoffee(null);
        setCurrentView('list');
      } catch (error) {
        console.error('Erro ao excluir café:', error);
        toast.error('Erro ao excluir café', {
          position: 'bottom-right',
          duration: 5000
        });
      }
    }
  };

  const handleReorderCoffees = async (newOrder) => {
    try {
      await fetch('http://localhost:3001/coffees/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order: newOrder })
      });
      console.log('Ordem atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar ordem dos cafés:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <motion.div
            ref={sidepanelContentRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[600px] bg-white shadow-lg p-6 flex flex-col z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-md font-semibold text-gray-700 uppercase">
                {currentView === 'list' && 'Cafés cadastrados'}
                {currentView === 'create' && 'Cadastrar novo café'}
                {currentView === 'edit' && (
                  <>
                    <span className="block text-slate-500 text-sm">
                      {selectedCoffee?.coffeeRoaster || 'Roaster'}
                    </span>
                    {selectedCoffee?.coffeeName || 'Café'}
                  </>
                )}
              </h2>
              <button
                onClick={onClose}
                className="btn-close text-gray-500 hover:text-gray-700 text-3xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 scrollbar">
              {currentView === 'list' ? (
                <CoffeeList
                  coffees={coffees}
                  onSelectCoffee={handleSelectCoffee}
                  onReorder={handleReorderCoffees}
                />
              ) : (
                <CoffeeForm
                  onSubmit={handleFormSubmit}
                  ref={formRef}
                  initialData={currentView === 'create' ? {} : selectedCoffee}
                />
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              {currentView === 'list' ? (
                <>
                  <button
                    className="px-5 py-3 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400 hover:text-white transition tracking-wide"
                    onClick={onClose}
                  >
                    Fechar
                  </button>
                  <button
                    className="px-5 py-3 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition tracking-wide"
                    onClick={handleCadastrarNovoClick}
                  >
                    Cadastrar novo café
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-5 py-3 bg-slate-200 text-gray-800 rounded hover:bg-gray-400 transition"
                    onClick={handleBackToList}
                  >
                    <CgArrowLeft />
                  </button>
                  <div className="flex space-x-2">
                    <button
                      className="px-5 py-3 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition tracking-wide"
                      onClick={() => {
                        if (formRef.current) {
                          formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        }
                      }}
                    >
                      {currentView === 'create' ? 'Salvar café' : 'Atualizar café'}
                    </button>
                    {currentView === 'edit' && (
                      <button
                        className="px-5 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={handleDeleteClick}
                      >
                        <LuTrash2 />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoffeeSidepanel;
