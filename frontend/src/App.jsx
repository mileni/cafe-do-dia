// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CoffeeSidepanel from './components/CoffeeSidepanel';
import DayCoffeeModal from './components/DayCoffeeModal';
import ConfirmationModal from './components/ConfirmationModal';
import {
  createCoffee,
  getAllCoffees,
  updateCoffee,
  deleteCoffee,
  createDayCoffee,
  getAllDayCoffees,
  updateDayCoffee, 
  deleteDayCoffee,
} from './services/api';
import toast, { Toaster } from 'react-hot-toast';
import { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
registerLocale('pt-BR', ptBR);

function App() {
  const [isCoffeeSidepanelOpen, setIsCoffeeSidepanelOpen] = useState(false);
  const [isDayCoffeeModalOpen, setIsDayCoffeeModalOpen] = useState(false);
  const [coffees, setCoffees] = useState([]);
  const [dayCoffees, setDayCoffees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dayCoffeeToDelete, setDayCoffeeToDelete] = useState(null);

  const [dayCoffeeToEdit, setDayCoffeeToEdit] = useState(null);

  useEffect(() => {
    fetchCoffees();
    fetchDayCoffees();
  }, []);

  const fetchCoffees = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCoffees();
      setCoffees(data);
    } catch (error) {
      console.error('Falha ao carregar cafés:', error);
      toast.error('Erro ao carregar cafés.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDayCoffees = async () => {
    try {
      const data = await getAllDayCoffees();
      setDayCoffees(data);
    } catch (error) {
      console.error('Falha ao carregar cafés do dia:', error);
    }
  };

  const handleOpenCoffeeSidepanel = () => {
    setIsCoffeeSidepanelOpen(true);
  };

  const handleCloseCoffeeSidepanel = () => {
    setIsCoffeeSidepanelOpen(false);
    fetchCoffees();
  };

  const handleOpenDayCoffeeModal = (dayCoffee = null) => {
    setDayCoffeeToEdit(dayCoffee);
    setIsDayCoffeeModalOpen(true);
  };

  const handleCloseDayCoffeeModal = () => {
    setDayCoffeeToEdit(null);
    setIsDayCoffeeModalOpen(false);
    fetchDayCoffees();
  };
  
  const handleSaveDayCoffee = async (data) => {
    setIsLoading(true);
    try {
        if (dayCoffeeToEdit) {
            await updateDayCoffee(data.dayCoffeeId, data);
            toast.success('Café do dia atualizado com sucesso!');
        } else {
            await createDayCoffee(data);
            toast.success('Café do dia cadastrado com sucesso!');
        }
      handleCloseDayCoffeeModal();
    } catch (error) {
      console.error('Erro ao salvar café do dia:', error);
      toast.error('Erro ao salvar café do dia.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteModal = (dayCoffeeId) => {
    setDayCoffeeToDelete(dayCoffeeId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDayCoffeeToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteDayCoffee = async () => {
    if (!dayCoffeeToDelete) return;
    setIsLoading(true);
    try {
      await deleteDayCoffee(dayCoffeeToDelete);
      toast.success('Café do dia excluído com sucesso!');
      fetchDayCoffees();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir café do dia:', error);
      toast.error('Erro ao excluir café do dia.');
    } finally {
      setIsLoading(false);
    }
  };

  const prepareCoffeeFormData = (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'coffeeImage') {
        if (data[key] && data[key][0] instanceof File) {
          formData.append(key, data[key][0]);
        }
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  };

  const handleCoffeeFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = prepareCoffeeFormData(data);
      await createCoffee(formData);
      toast.success('Café cadastrado com sucesso!');
      fetchCoffees();
    } catch (error) {
      console.error('Erro ao cadastrar café:', error);
      toast.error('Erro ao cadastrar café. Verifique o console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCoffee = async (data) => {
    try {
      setIsLoading(true);
      const formData = prepareCoffeeFormData(data);
      await updateCoffee(data.coffeeId, formData);
      toast.success('Café atualizado com sucesso!');
      fetchCoffees();
    } catch (error) {
      console.error('Erro ao atualizar café:', error);
      toast.error('Erro ao atualizar café. Verifique o console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoffee = async (coffeeId) => {
    try {
      setIsLoading(true);
      await deleteCoffee(coffeeId);
      toast.success('Café excluído com sucesso!');
      fetchCoffees();
    } catch (error) {
      console.error('Erro ao excluir café:', error);
      toast.error('Erro ao excluir café. Verifique o console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">				
				<Toaster
					reverseOrder={false}
					position="top-right"
					toastOptions={{
						duration: 10000, // padrão de duração para todos
						style: {
							background: '#38220f',
							color: '#fff',
							fontSize: '14px',
							borderRadius: '4px',
							paddingTop: '15px',
      				paddingRight: '20px',
      				paddingBottom: '15px',
      				paddingLeft: '20px',
						},
						success: {
							iconTheme: {
								primary: '#4caf50',
								secondary: '#1b5e20',
							},
						},
						error: {
							iconTheme: {
								primary: '#f44336',
								secondary: '#b71c1c',
							},
						},
					}}
				/>
        <Routes>
          <Route path="/" element={
            <Home
              onOpenCoffeeSidepanel={handleOpenCoffeeSidepanel}
              onOpenDayCoffeeModal={() => handleOpenDayCoffeeModal()}
              isAnyCoffeeRegistered={coffees.length > 0}
              dayCoffees={dayCoffees}
              onOpenDeleteModal={handleOpenDeleteModal}
              onOpenEditModal={(dayCoffee) => handleOpenDayCoffeeModal(dayCoffee)}
            />}
          />
        </Routes>

        <CoffeeSidepanel
          isOpen={isCoffeeSidepanelOpen}
          onClose={handleCloseCoffeeSidepanel}
          onSubmit={handleCoffeeFormSubmit}
          onUpdateCoffee={handleUpdateCoffee}
          onDeleteCoffee={handleDeleteCoffee}
          coffees={coffees}
        />

        <DayCoffeeModal
          isOpen={isDayCoffeeModalOpen}
          onClose={handleCloseDayCoffeeModal}
          coffees={coffees}
          onSubmit={handleSaveDayCoffee}
          onUpdate={handleSaveDayCoffee}
          dayCoffeeToEdit={dayCoffeeToEdit}
        />

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteDayCoffee}
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir este café do dia? Esta ação não pode ser desfeita."
        />

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <p className="text-white text-lg">Carregando...</p>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;