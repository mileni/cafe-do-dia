// frontend/src/components/Modal.jsx
import React, { useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import { PiCoffeeBeanFill, PiCoffeeBean } from "react-icons/pi";
import useOutsideClick from '../hooks/useOutsideClick';

// Função para limpar string
const cleanString = (str) => {
  if (str === null || str === undefined) return 'Não informado';
  const cleaned = String(str).replace(/\r\n/g, ' ').replace(/\n/g, ' ').trim();
  return cleaned.length === 0 ? 'Não informado' : cleaned;
};

// Formata data
const formatDate = (date) => {
  if (!date) return 'Não informada';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

// Verifica se o valor é válido para exibição
const isValueValid = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string' && val.trim() === '') return false;
  return true;
};

// Componente de bolinhas para pontuação
const ScoreDots = ({ score = 0 }) => {
  const parsedScore = Math.round(score) || 0;
  const maxScore = 5;

  return (
    <div className="flex gap-1 items-center" title={`${parsedScore}/${maxScore}`}>
      {Array.from({ length: maxScore }, (_, index) => (
				<span key={index} className="text-md">
					{index < parsedScore ? (
						<PiCoffeeBeanFill className="text-yellow-500" />
					) : (
						<PiCoffeeBean className="text-gray-300" />
					)}
				</span>
			))}
    </div>
  );
};

// Componente Modal
const Modal = ({ isOpen, onClose, coffee }) => {
  const contentRef = useRef(null);
  useOutsideClick(contentRef, onClose, isOpen);

  if (!isOpen) return null;

  const data = coffee?.coffee ? coffee.coffee : coffee || {};
	const { coffeeRoaster } = data;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={contentRef} className="modalCoffee bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-hidden max-h-[90vh]">
        <header className="flex justify-between items-start">
          <h2 className="text-md font-semibold text-gray-700 uppercase mb-4">
            {cleanString(data.coffeeRoaster)} {cleanString(data.coffeeName)}
          </h2>
          <button
            onClick={onClose}
            className="btn-close text-gray-500 hover:text-gray-700 text-3xl font-light"
          >
            &times;
          </button>
        </header>

        <div className="flex overflow-y-auto scrollbar max-h-[70vh] gap-5">
          {/* Coluna 1 */}
          <div className="col1 w-2/5 flex-shrink-0 rounded-lg bg-stone-100">
            <div className={`coffeeImage relative mb-4  rounded-t-lg ${data.coffeeRoaster === 'Tocaya' ? 'coffee--tocaya' : ''} ${data.coffeeRoaster === 'Veroo' ? 'coffee--veroo' : ''} ${coffeeRoaster === 'Realcafé Reserva' ? 'coffee--realcafe' : ''} ${data.coffeeRoaster === 'Schott Café' ? 'coffee--schott' : ''}`}>

							{/* CORREÇÃO APLICADA: Verifica se coffeeTop é true (booleano) */}
							{data.coffeeTop && (
									<BiSolidBadgeCheck className="badgeTop text-yellow-500" size={32} />
							)}
              {isValueValid(data.coffeeImage) && (
								<picture>
									<img
										src={`http://localhost:3001${data.coffeeImage}`}
										alt={data.coffeeName}
										className="w-full h-48 object-contain rounded-t-lg"
									/>
								</picture>
              )}
            </div>

            <div className="space-y-2 coffeeScore p-4">		
              {isValueValid(data.coffeeSensory) && (
                <p className="coffeeItem text-xs mb-5">
                  <label>Notas/sensorial:</label> {cleanString(data.coffeeSensory)}
                </p>
              )}
							
              {isValueValid(data.coffeeScore) && (
                <p className="coffeeItem text-xs">
                  <label>Pontuação:</label> {cleanString(data.coffeeScore)}
                </p>
              )}

              {data.coffeeAcidity != null && (
                <div className="flex flex-col">
                  <label>Acidez:</label>
                  <ScoreDots score={data.coffeeAcidity} />
                </div>
              )}

              {data.coffeeSweetness != null && (
                <div className="flex flex-col">
                  <label>Doçura:</label>
                  <ScoreDots score={data.coffeeSweetness} />
                </div>
              )}

              {data.coffeeFullBodied != null && (
                <div className="flex flex-col">
                  <label>Corpo:</label>
                  <ScoreDots score={data.coffeeFullBodied} />
                </div>
              )}

              {data.coffeeBitterness != null && (
                <div className="flex flex-col">
                  <label>Amargor:</label>
                  <ScoreDots score={data.coffeeBitterness} />
                </div>
              )}
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="coffeeContent col2 w-3/5 overflow-y-auto pr-2 scrollbar max-h-[70vh]">						
						<div className="space-y-2">							
							<div className="flex">
								<div className="w-1/2">							
									{isValueValid(data.coffeePurchaseDate) && (
										<p className="coffeeItem text-sm">
											<label>Data de Compra:</label> {formatDate(data.coffeePurchaseDate)}
										</p>
									)}
								</div>
								<div className="w-1/2">
									{isValueValid(data.coffeeRoastDate) && (
										<p className="coffeeItem text-sm"><label>Data de Torra:</label> {formatDate(data.coffeeRoastDate)}</p>
									)}
								</div>
							</div>

							{isValueValid(data.coffeePurchaseLocation) && (
								<p className="coffeeItem text-sm">
									<label>Local de Compra:</label> {cleanString(data.coffeePurchaseLocation)}
								</p>
							)}

							{isValueValid(data.coffeeGrind) && (
								<p className="coffeeItem text-sm">
									<label>Melhor moagem para este café (Tramontina Breville Grinder):</label> {cleanString(data.coffeeGrind)}
								</p>
							)}

							{isValueValid(data.coffeeObservation) && (
								<p className="coffeeItem text-sm whitespace-pre-line">
									<label>Observação:</label> {data.coffeeObservation}
								</p>
							)}
						</div>

            <hr />

						<div className="coffeeInfo space-y-1">
							{isValueValid(data.coffeeRoaster) && (
								<p className="coffeeItem text-sm"><label>Torrefação:</label> {cleanString(data.coffeeRoaster)}</p>
							)}
							
							{isValueValid(data.coffeeBeanType) && (
								<p className="coffeeItem text-sm"><label>Tipo do grão:</label> {cleanString(data.coffeeBeanType)}</p>
							)}

							{isValueValid(data.coffeeOrigin) && (
								<p className="coffeeItem text-sm"><label>Origem:</label> {cleanString(data.coffeeOrigin)}</p>
							)}

							{isValueValid(data.coffeeProducer) && (
								<p className="coffeeItem text-sm"><label>Produtor:</label> {cleanString(data.coffeeProducer)}</p>
							)}

							{isValueValid(data.coffeeVariation) && (
								<p className="coffeeItem text-sm"><label>Variedade:</label> {cleanString(data.coffeeVariation)}</p>
							)}

							{isValueValid(data.coffeeType) && (
								<p className="coffeeItem text-sm hidden"><label>Categoria:</label> {cleanString(data.coffeeType)}</p>
							)}

							{isValueValid(data.coffeeProcess) && (
								<p className="coffeeItem text-sm"><label>Processo:</label> {cleanString(data.coffeeProcess)}</p>
							)}

							{isValueValid(data.coffeeAltitude) && (
								<p className="coffeeItem text-sm"><label>Altitude:</label> {cleanString(data.coffeeAltitude)}</p>
							)}

						</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;