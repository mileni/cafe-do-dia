// frontend/src/forms/CoffeeForm/PurchaseInfo.jsx
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { formatCurrencyBR } from '../../utils/formatCurrencyBR'; // ajuste o caminho se necessário

const PurchaseInfo = ({ register, control, observationTextareaRef, adjustObservationHeight }) => {
  const [formattedPrice, setFormattedPrice] = useState('');

  return (
    <div className="space-y-4 mr-2">
      <div className="flex gap-4">
        {/* Local da compra */}
        <div className="basis-3/5">
          <label
            htmlFor="coffeePurchaseLocation"
            className="block text-gray-700 text-xs font-semibold mb-1"
          >
            Local da compra
          </label>
          <input
            type="text"
            id="coffeePurchaseLocation"
            placeholder="Onde foi comprado"
            {...register('coffeePurchaseLocation')}
            className="appearance-none border rounded w-full py-2 px-3 text-xs text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Preço do café */}
        <div className="basis-2/5">
          <label
            htmlFor="coffeePrice"
            className="block text-gray-700 text-xs font-semibold mb-1"
          >
            Preço do café
          </label>
          <Controller
						name="coffeePrice"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value, ...restField } }) => (
							<input
								type="text"
								id="coffeePrice"
								placeholder="Ex: R$ 35,00"
								value={formatCurrencyBR(value || '')}
								onChange={(e) => {
									const rawValue = e.target.value;
									const numeric = rawValue.replace(/\D/g, '');
									onChange(numeric); // armazena apenas números no form
								}}
								className="appearance-none border rounded w-full py-2 px-3 text-xs text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								{...restField}
							/>
  )}
/>

        </div>
      </div>

      {/* Observações */}
      <div>
        <label
          htmlFor="coffeeObservation"
          className="block text-gray-700 text-xs font-semibold mb-1"
        >
          Minhas observações
        </label>
        <Controller
          name="coffeeObservation"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea
              id="coffeeObservation"
              ref={(el) => {
                observationTextareaRef.current = el;
                field.ref(el);
              }}
              value={field.value}
              rows={5}
              onChange={(e) => {
                field.onChange(e);
                adjustObservationHeight();
              }}
              placeholder="Outras observações"
              className="appearance-none border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline overflow-hidden resize-none"
            />
          )}
        />
      </div>
    </div>
  );
};

export default PurchaseInfo;
