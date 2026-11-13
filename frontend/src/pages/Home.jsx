// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { FaCoffee, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PiCoffeeBean } from "react-icons/pi";
import { GiCoffeeBeans } from "react-icons/gi";
import { SiVite } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { FaSass } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { FiCoffee } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { PiNotePencil } from "react-icons/pi";
import DayCoffeeCard from '../components/DayCoffeeCard';
import DayNoteModal from '../components/DayNoteModal';
import ConfirmationModal from '../components/ConfirmationModal';

const Home = ({
  onOpenCoffeeSidepanel,
  onOpenDayCoffeeModal,
  isAnyCoffeeRegistered,
  dayCoffees,
  onOpenDeleteModal,
  onOpenEditModal
}) => {
  const [groupedDayCoffees, setGroupedDayCoffees] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);

  const openNoteModal = () => setIsNoteModalOpen(true);
  const closeNoteModal = () => setIsNoteModalOpen(false);

  // 🔹 Carregar notas do banco ao iniciar
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/day-notes');
        if (!response.ok) throw new Error('Erro ao carregar notas');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      }
    };
    fetchNotes();
  }, []);

  // 🔹 Editar nota
  const handleEditNote = (note) => {
    setNoteToEdit(note);
    setIsNoteModalOpen(true);
  };

  // 🔹 Criar ou atualizar nota
  const handleSaveNote = async (newNote) => {
    const formattedNote = {
      noteDate: newNote.noteDate,
      noteContent: newNote.noteText,
    };

    // Se estiver editando
    if (noteToEdit) {
      try {
        const response = await fetch(`http://localhost:3001/api/day-notes/${noteToEdit.dayNoteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedNote),
        });
        if (!response.ok) throw new Error('Erro ao atualizar nota');
        const updated = await response.json();
        setNotes(prev =>
          prev.map(n => (n.dayNoteId === updated.dayNoteId ? updated : n))
        );
      } catch (error) {
        console.error('Erro ao atualizar nota:', error);
      } finally {
        setNoteToEdit(null);
        closeNoteModal();
      }
      return;
    }

    // Se for nova nota
    try {
      const response = await fetch('http://localhost:3001/api/day-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedNote),
      });

      if (!response.ok) throw new Error('Erro ao salvar nota');
      const savedNote = await response.json();
      setNotes(prevNotes => [...prevNotes, savedNote]);
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    } finally {
      closeNoteModal();
    }
  };

  // 🔹 Abrir modal de confirmação para deletar
  const handleOpenDeleteModal = (id) => {
    setNoteIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 🔹 Confirmar exclusão
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/day-notes/${noteIdToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar nota');
      setNotes(prev => prev.filter(n => n.dayNoteId !== noteIdToDelete));
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setNoteIdToDelete(null);
    }
  };

  // 🔹 Agrupar cafés por data
  useEffect(() => {
    if (dayCoffees && dayCoffees.length > 0) {
      const grouped = dayCoffees.reduce((acc, coffee) => {
        const date = coffee.dayDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(coffee);
        return acc;
      }, {});

      const dates = Object.keys(grouped).map(dateStr => parse(dateStr, 'dd/MM/yyyy', new Date()));
      dates.sort((a, b) => b.getTime() - a.getTime());

      setSortedDates(dates);
      setGroupedDayCoffees(grouped);
      setCurrentDateIndex(0);
    } else {
      setGroupedDayCoffees({});
      setSortedDates([]);
      setCurrentDateIndex(0);
    }
  }, [dayCoffees]);

  const handlePreviousDate = () => {
    if (currentDateIndex < sortedDates.length - 1) setCurrentDateIndex(prev => prev + 1);
  };

  const handleNextDate = () => {
    if (currentDateIndex > 0) setCurrentDateIndex(prev => prev - 1);
  };

  const currentFormattedDate = sortedDates.length > 0
    ? format(sortedDates[currentDateIndex], 'EEEE, dd MMMM yyyy', { locale: ptBR })
    : 'Nenhuma data encontrada';

  const currentDayCoffees = sortedDates.length > 0
    ? groupedDayCoffees[format(sortedDates[currentDateIndex], 'dd/MM/yyyy')] || []
    : [];

  const currentNotes = sortedDates.length > 0
    ? notes.filter(note => note.noteDate === format(sortedDates[currentDateIndex], 'dd/MM/yyyy'))
    : [];

  const isPreviousButtonDisabled = currentDateIndex >= sortedDates.length - 1;
  const isNextButtonDisabled = currentDateIndex <= 0;

  return (
    <main className="min-h-screen">
      <div className="topbar">
        <h6 className="text-[10px] text-white text-center uppercase">
          This is about coffee
          <div className="hidden">espresso: strong, potent coffee brews for strong, potent coffee lovers.</div>
        </h6>
      </div>

      <header className="mb-8 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center text-2 font-bold text-gray-900 text-center my-1 space-x-4 gap-[10px] uppercase text-[#634832CC]">
              <GiCoffeeBeans className="min-w-[1em]" style={{ fontSize: '32px', color: '#967259' }} />
              Café do dia
            </h1>
            <div className="flex justify-end space-x-4">
              <button
								onClick={onOpenDayCoffeeModal}
								className={`btn-primary flex items-center px-6 py-3 text-sm rounded transition ${
									!isAnyCoffeeRegistered ? 'cursor-not-allowed' : ''
								}`}
								disabled={!isAnyCoffeeRegistered}
							>
                <FaCoffee className="mr-2" /> Café do Dia
              </button>
              <button
                onClick={onOpenCoffeeSidepanel}
                className="btn-primary flex items-center px-6 py-3 text-sm rounded transition"
              >
                <PiCoffeeBean className="mr-2" /> Cadastrar Café
              </button>
              <button
                onClick={() => {
                  setNoteToEdit(null);
                  openNoteModal();
                }}
                className="btn-primary flex items-center px-6 py-3 text-sm rounded transition"
              >
								<PiNotePencil className="mr-2" /> Incluir Nota
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pb-[100px] px-5">
        <header className="mb-8 flex items-center justify-between">
          {dayCoffees.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700">{currentFormattedDate}</h2>
            </div>
          )}

          {dayCoffees.length > 0 && (
            <div className="nav flex justify-center items-center space-x-4">
              <button
                onClick={handlePreviousDate}
                disabled={isPreviousButtonDisabled}
                className={`flex items-center p-3 text-sm rounded transition duration-300 font-semibold ${isPreviousButtonDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
              >
                <FaChevronLeft />
              </button>
              <span className="text-sm font-medium text-gray-500 w-[100px] text-center">
                {currentDateIndex + 1} de {sortedDates.length}
              </span>
              <button
                onClick={handleNextDate}
                disabled={isNextButtonDisabled}
                className={`flex items-center p-3 text-sm rounded transition duration-300 font-semibold ${isNextButtonDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </header>

				{/* ---------- CAFÉS ---------- */}
				<div
					className={`grid gap-8 ${
						currentDayCoffees.length === 1
							? 'grid-cols-1 md:grid-cols-1 lg:grid-cols-3'
							: currentDayCoffees.length === 2
							? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
							: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
					}`}
				>
					{currentDayCoffees.length > 0 ? (
						currentDayCoffees.map((dayCoffee, index) => (
							<DayCoffeeCard
								key={dayCoffee.dayCoffeeId}
								dayCoffee={dayCoffee}
								onDelete={() => onOpenDeleteModal(dayCoffee.id || dayCoffee.dayCoffeeId)}
								onEdit={() => onOpenEditModal(dayCoffee)}
								index={index}
							/>
						))
					) : (
						<div className="col-span-full text-center py-10 text-gray-500 text-lg">
							<p>Nenhum café do dia cadastrado para esta data.</p>
						</div>
					)}
				</div>

				{/* ---------- NOTAS ---------- */}
        <div className="mt-10 mb-4" id="notes">
          {sortedDates.length > 0 && currentNotes.length > 0 && (
            currentNotes.map(note => (
              <div key={note.dayNoteId} className="nota p-4 text-xs border border-gray-100 rounded bg-white flex justify-between items-start mb-2">
                <div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-[18px]">
                    {note.noteTime && (
                      <span className="font-mono text-[9px] text-gray-500 mr-2 mb-1 px-2 rounded bg-[#dbc1ac80] table">
                        {note.noteTime}
                      </span>
                    )}
                    {note.noteContent}
                  </p>
                </div>
                <div className="flex space-x-1 ml-4">
                  <button onClick={() => handleEditNote(note)} className="p-2 hover:bg-gray-100 rounded-full transition"><MdOutlineModeEdit /></button>
                  <button onClick={() => handleOpenDeleteModal(note.dayNoteId)} className="p-2 hover:bg-gray-100 rounded-full transition"><FiTrash2 /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer>
        © Criado e desenvolvido com <FaReact /> <SiVite /> <FaSass /> <FaHtml5 /> AI, paciência e muito <FiCoffee />
      </footer>

      {/* ---------- MODAIS ---------- */}
      <DayNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          closeNoteModal();
          setNoteToEdit(null);
        }}
        onSubmit={handleSaveNote}
        dayNoteToEdit={noteToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Nota"
        message="Tem certeza de que deseja excluir esta nota? Essa ação não pode ser desfeita."
      />
    </main>
  );
};

export default Home;
