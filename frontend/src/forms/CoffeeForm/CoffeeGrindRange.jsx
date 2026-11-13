// frontend/src/forms/CoffeeForm/CoffeeGrindRange.jsx
import React from 'react';

const CoffeeGrindRange = ({ grindValue, setGrindValue, register }) => {
  return (
    <div>
      <label
        htmlFor="coffeeGrind"
        className="block text-gray-700 text-xs font-semibold mb-1"
      >
        Moagem ideal para esse café: <br />
        <div className="flex gap-1">
          <span className="text-gray-900 font-bold">{grindValue}</span>
          <span className="text-gray-400 font-normal">
            (1 = Muito fina, 60 = Muito grossa)
          </span>
        </div>
      </label>
      <input
        type="range"
        id="coffeeGrind"
        min="1"
        max="60"
        step="1"
        value={grindValue}
        onChange={(e) => {
          setGrindValue(Number(e.target.value));
        }}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <input type="hidden" value={grindValue} {...register('coffeeGrind')} />
      {/* Marcas visuais */}
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        {[1, 10, 20, 30, 40, 50, 60].map((val) => (
          <span key={val}>{val}</span>
        ))}
      </div>
    </div>
  );
};

export default CoffeeGrindRange;
