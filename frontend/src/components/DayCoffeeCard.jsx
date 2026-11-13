import React, { useState } from 'react';
import { FaCalendarAlt, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { MdOutlineModeEdit } from "react-icons/md";
import { TfiTrash } from "react-icons/tfi";
import { FiDroplet } from 'react-icons/fi';
import { GiPowder } from 'react-icons/gi';
import { MdOutlineCoffeeMaker } from 'react-icons/md';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Modal from './Modal';
import { FiCoffee } from "react-icons/fi";
import { PiCoffeeBold } from "react-icons/pi";
import { FiTrash2 } from "react-icons/fi";

// DayCoffeeCard Component
const DayCoffeeCard = ({ dayCoffee, onDelete, onEdit, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!dayCoffee || !dayCoffee.coffee) {
    return null;
  }

  const { dayDate, dayMethod, dayRecipe, dayGrind, dayObservation, coffee } = dayCoffee;
  const { coffeeName, coffeeRoaster, coffeeImage } = coffee;

  const renderCoffeeImage = () => {
    if (coffeeImage) {
      return (
        <img
          src={`http://localhost:3001${coffeeImage}`}
          alt={coffeeName}
          className="w-full h-48 object-contain rounded-t-lg thumb"
        />
      );
    }
    return (
      <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-500">
        Nenhuma Imagem
      </div>
    );
  };

  const formattedDate = dayDate
    ? format(parse(dayDate, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy', { locale: ptBR })
    : 'Data não informada';

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col">
			<div className="relative">
				
				<span className="absolute text-[12px] text-gray-600 font-semibold mb-2 ml-2 rounded-sm bottom-0 left-0 px-2 py-1 bg-[#dbc1ac80]">
          Café #{String(index + 1).padStart(2, '0')}
        </span>
				
				{/* Botões de Ação para Edição e Exclusão */}
				<div className="absolute p-4 flex justify-end space-x-2 mt-auto z-[1] right-0 top-0">
					<button
						onClick={onEdit}
						className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#00000099] text-white rounded hover:bg-[#000000CC] transition"
					>
						<MdOutlineModeEdit />
					</button>
					<button
						onClick={onDelete}
						className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#00000099] text-white rounded hover:bg-[#000000CC] transition"
					>
						<FiTrash2 />
					</button>
					{/* Botão para abrir a modal */}
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#00000099] text-white rounded hover:bg-[#000000CC] transition"
					>
						<PiCoffeeBold />
					</button>
				</div>

				<div className={`card-img-container ${coffeeRoaster === 'Sydra' ? 'coffee--sydra' : ''} ${coffeeRoaster === 'Tocaya' ? 'coffee--tocaya' : ''} ${coffeeRoaster === 'Veroo' ? 'coffee--veroo' : ''} ${coffeeRoaster === 'Schott Café' ? 'coffee--schott' : ''} ${coffeeRoaster === 'Realcafé Reserva' ? 'coffee--realcafe' : ''}${coffeeRoaster === 'Scaféllo' ? 'coffee--scafello' : ''} ${coffeeRoaster === 'Ouro do Cerrado' ? 'coffee--ourodocerrado' : ''}`}>
					{renderCoffeeImage()}
				</div>
			</div>

      <div className="p-4">
        <div className="mb-4">
          <div className="pRoaster text-gray-400 tracking-widest">{coffeeRoaster}</div>
          <h3 className="text-xl font-light text-gray-800 cursor-pointer" onClick={() => setIsModalOpen(true)}>{coffeeName}</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-700 hidden">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <span className="text-[13px]"><label className="font-semibold">Data do preparo:</label> {formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MdOutlineCoffeeMaker className="text-gray-500 mr-2 min-w-[1em]" style={{ fontSize: '18px' }} />
            <span className="text-[13px]"><label className="font-semibold">Método:</label> {dayMethod || 'Não informado'}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <GiPowder className="text-gray-500 mr-2 min-w-[1em]" style={{ fontSize: '18px' }} />
            <span className="text-[13px]"><label className="font-semibold">Moagem:</label> {dayGrind || 'Não informada'}</span>
          </div>

          {dayRecipe && (
						<div className="flex items-start text-gray-700 text-[13px]">
							<FiDroplet
								className="text-gray-500 mr-2 mt-1 min-w-[1em]"
								style={{ fontSize: '18px' }}
							/>
							<div>
								<label className="font-semibold mb-1 mr-1 block">Receita:</label>
								<span className="whitespace-pre-line">{dayRecipe}</span>
							</div>
						</div>
					)}
        </div>

        {dayObservation && (
					<div className="mt-[20px] text-xs text-zinc-400">
						<div className="font-semibold mb-1">Nota:</div>
						<div className="whitespace-pre-line">
							{dayObservation}
						</div>
					</div>
				)}

      </div>

      {/* Botões de Ação para Edição e Exclusão */}
      <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2 mt-auto hidden">
        <button
          onClick={onEdit}
          className="flex items-center text-[9px] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition uppercase tracking-widest"
        >
          <FaPencilAlt className="mr-2" /> Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center text-[9px] px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition uppercase tracking-widest"
        >
          <FaTrashAlt className="mr-2" /> Excluir
        </button>
        {/* Botão para abrir a modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-[9px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition uppercase tracking-widest"
        >
          Ver Detalhes
        </button>
      </div>

      {/* Exibindo a modal */}
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coffee={coffee} />}
    </div>
  );
};

export default DayCoffeeCard;
