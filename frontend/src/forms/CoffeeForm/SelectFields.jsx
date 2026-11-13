// frontend/src/forms/CoffeeForm/SelectFields.jsx
// Contém os campos coffeeBeanType, coffeeVariation, coffeeProcess, coffeeAltitude, coffeeType, coffeeRoastType e coffeeScore.
import React from 'react';

const SelectFields = ({ register, dataLists }) => {
	const {
		beanTypes,
		processTypes,
		coffeeTypes,
		roastTypes,
		variationTypes
	} = dataLists;

	return (
		<div className="space-y-4">
			<div>
				<label htmlFor="coffeeBeanType" className="block text-gray-700 text-xs font-semibold mb-1">Tipo de grão</label>
				<select
					id="coffeeBeanType"
					{...register('coffeeBeanType')}
					className="border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Selecione...</option>
					{beanTypes.map(type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="coffeeVariation" className="block text-gray-700 text-xs font-semibold mb-1">Variedade</label>
				<select
					id="coffeeVariation"
					{...register('coffeeVariation')}
					className="border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Selecione...</option>
					{variationTypes.map(type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="coffeeProcess" className="block text-gray-700 text-xs font-semibold mb-1">Tipo de processamento</label>
				<select
					id="coffeeProcess"
					{...register('coffeeProcess')}
					className="border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Selecione...</option>
					{processTypes.map(type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>
			
			<div>
				<label htmlFor="coffeeAltitude" className="block text-gray-700 text-xs font-semibold mb-1">Altitude</label>
				<input
					type="text"
					id="coffeeAltitude"
					placeholder="Ex: 1200m"
					{...register('coffeeAltitude')}
					className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>

			<div>
				<label htmlFor="coffeeType" className="block text-gray-700 text-xs font-semibold mb-1">Classificação do café</label>
				<select
					id="coffeeType"
					{...register('coffeeType')}
					className="border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Selecione...</option>
					{coffeeTypes.map(type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="coffeeRoastType" className="block text-gray-700 text-xs font-semibold mb-1">Tipo de torra</label>
				<select
					id="coffeeRoastType"
					{...register('coffeeRoastType')}
					className="border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Selecione...</option>
					{roastTypes.map(type => (
						<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="coffeeScore" className="block text-gray-700 text-xs font-semibold mb-1">Pontuação</label>
				<input
					type="text"
					id="coffeeScore"
					placeholder="Ex: 88.5 (SCA)"
					{...register('coffeeScore')}
					className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		</div>
	);
};

export default SelectFields;