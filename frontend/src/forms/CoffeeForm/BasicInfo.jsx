// frontend/src/forms/CoffeeForm/BasicInfo.jsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { BiBadgeCheck, BiSolidBadgeCheck } from 'react-icons/bi';

const BasicInfo = ({ register, errors, control }) => {
	
	return (
		<div className="space-y-4">
			<div>
				<label htmlFor="coffeeName" className="block text-gray-700 text-xs font-semibold mb-1">Nome do café</label>
				<div className="flex gap-3 items-center">
					<input
						type="text"
						id="coffeeName"
						placeholder="Nome do café"
						{...register('coffeeName', { required: 'O nome do café é obrigatório.' })}
						className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
					{errors.coffeeName && <p className="text-red-500 text-xs italic">{errors.coffeeName.message}</p>}
						
					{/* CORREÇÃO: Usamos Controller com shouldUnregister: false */}
					<Controller
						name="coffeeTop"
						control={control}
						rules={{ shouldUnregister: false }}
						render={({ field }) => (
							<button
								type="button"
								// Alterna o valor e atualiza o RHF.
								onClick={() => field.onChange(!field.value)} 
								className="transition-colors"
							>
								{/* field.value é o valor booleano puro atual no RHF */}
								{field.value ? ( 
									<BiSolidBadgeCheck className="text-yellow-500" size={24} />
								) : (
									<BiBadgeCheck className="text-gray-300" size={24} />
								)}
							</button>
						)}
					/>
				</div>
			</div>

			<div className="flex flex-col">
				<label htmlFor="coffeeRoaster" className="block text-gray-700 text-xs font-semibold mb-1">Torrefação</label>
				<input
					type="text"
					id="coffeeRoaster"
					placeholder="Torrefação"
					{...register('coffeeRoaster', { required: 'A torrefação é obrigatória.' })}
					className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				{errors.coffeeRoaster && <p className="text-red-500 text-xs italic">{errors.coffeeRoaster.message}</p>}
			</div>
			
			<div className="flex flex-col">
				<label htmlFor="coffeeSensory" className="block text-gray-700 text-xs font-semibold mb-1">Notas/Sensorial</label>
				<textarea
					id="coffeeSensory"
					placeholder="Notas de sabor, aroma, etc."
					{...register('coffeeSensory')}
					rows="2"
					className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				></textarea>
			</div>

			<div className="flex flex-col">
				<label htmlFor="coffeeOrigin" className="block text-gray-700 text-xs font-semibold mb-1">Origem</label>
				<textarea
					id="coffeeOrigin"
					placeholder="Região, país, cidade, fazenda, sítio"
					{...register('coffeeOrigin')}
					rows="2"
					className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				></textarea>
			</div>

			<div className="flex flex-col">
				<label htmlFor="coffeeProducer" className="block text-gray-700 text-xs font-semibold mb-1">Produtor</label>
				<input
					type="text"
					id="coffeeProducer"
					placeholder="Nome do produtor"
					{...register('coffeeProducer')}
					className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		</div>
	);
};

export default BasicInfo;