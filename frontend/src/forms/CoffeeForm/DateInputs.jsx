// frontend/src/forms/CoffeeForm/DateInputs.jsx
import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';

const DateInputs = ({ control }) => {
  return (
    <div className="coffeePack space-y-4 mr-2">
      {/* Data de compra */}
      <div className="columns-2 gap-4">
        <div>
          <label
            htmlFor="coffeePurchaseDate"
            className="block text-gray-700 text-xs font-semibold mb-1"
          >
            Data da compra
          </label>
          <Controller
            name="coffeePurchaseDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd/MM/yyyy"
                locale={ptBR}
                placeholderText="dd/mm/yyyy"
                className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
        </div>

        {/* Data da torra */}
        <div>
          <label
            htmlFor="coffeeRoastDate"
            className="block text-gray-700 text-xs font-semibold mb-1"
          >
            Data da torra
          </label>
          <Controller
            name="coffeeRoastDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd/MM/yyyy"
                locale={ptBR}
                placeholderText="dd/mm/yyyy"
                className="appearance-none border rounded w-full text-xs py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DateInputs;
