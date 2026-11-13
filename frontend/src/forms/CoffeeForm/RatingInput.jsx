// frontend/src/forms/CoffeeForm/RatingInput.jsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { PiCoffeeBeanFill, PiCoffeeBean } from 'react-icons/pi';

const RatingInput = ({ name, control, label }) => {
	return (
		<div className="mb-4">
			<label htmlFor={name} className="block text-gray-700 text-xs font-semibold mb-1">{label}</label>
			<Controller
				name={name}
				control={control}
				rules={{ required: false }}
				render={({ field: { onChange, value } }) => (
					<div className="flex items-center space-x-1">
						{[1, 2, 3, 4, 5].map((level) => (
							<span
								key={level}
								onClick={() => onChange(level)}
								className="cursor-pointer text-brown-600 hover:text-brown-800 transition-colors"
							>
								{value >= level ? <PiCoffeeBeanFill size={18} /> : <PiCoffeeBean size={18} />}
							</span>
						))}
					</div>
				)}
			/>
		</div>
	);
};

export default RatingInput;