// frontend/src/forms/CoffeeForm/ImageUpload.jsx
import React from 'react';
import { CgClose } from "react-icons/cg";

const ImageUpload = ({ register, initialData, imagePreview, setImagePreview }) => {
	
	return (
		<div>
			<label className="block text-gray-700 text-xs font-semibold mb-1">Imagem (embalagem)</label>
			<div className="flex items-center justify-center relative w-32 h-32 border rounded cursor-pointer overflow-hidden group">
				<input
					type="file"
					accept="image/*"
					{...register('coffeeImage')}
					onChange={(e) => {
						const file = e.target.files[0];
						if (file) {
							setImagePreview(URL.createObjectURL(file));
						}
					}}
					className="absolute inset-0 opacity-0 cursor-pointer z-10"
				/>

				<div className="relative w-full h-full">
					{imagePreview ? (
						<img
							src={imagePreview}
							alt="Prévia da imagem"
							className="w-full h-full object-cover thumb"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-center text-gray-400 text-xs p-3">
							Selecionar imagem
						</div>
					)}
				
					{imagePreview && (
					<button
						type="button"
						onClick={async () => {
							setImagePreview(null);

							const input = document.querySelector('input[type="file"][name="coffeeImage"]');
							if (input) input.value = "";

							// Só tenta deletar a imagem se já houver um coffeeId e imagem original
							if (initialData?.coffeeId && initialData?.coffeeImage) {
								try {
									await fetch(`http://localhost:3001/api/coffees/${initialData.coffeeId}/image`, {
										method: 'DELETE',
									});
								} catch (error) {
									console.error("Erro ao deletar imagem no backend:", error);
								}
							}
						}}
						className="absolute opacity-75 top-0 right-0 z-10 text-xs size-8 flex rounded-full justify-center items-center text-white hover:underline bg-stone-400 mt-2 mr-2"
					>
						<CgClose />
					</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ImageUpload;