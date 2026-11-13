// frontend/src/forms/CoffeeForm/RoasterInfo.jsx
import React, { useEffect } from 'react';

const RoasterInfo = ({ register, errors, setValue, watch, textareaRef, roasterDescription }) => {
  // Atualiza o campo quando o valor inicial mudar
  useEffect(() => {
    if (roasterDescription) {
      setValue('roasterDescription', roasterDescription);
    }
  }, [roasterDescription, setValue]);

  const currentDescription = watch('roasterDescription', '');

  // Ajuste automático de altura local (independente de hook externo)
  const handleAdjustHeight = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  // Garante ajuste ao carregar/editar
  useEffect(() => {
    if (textareaRef?.current) {
      handleAdjustHeight(textareaRef.current);
    }
  }, [currentDescription, textareaRef]);

  return (
    <div className="space-y-4 p-4 rounded-md bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-700 border-b pb-2 mb-3">
        Informações adicionais da torrefação
      </h3>

      {/* Campo: Site da torrefação */}
      <div>
        <label htmlFor="roasterSite" className="block text-xs font-semibold text-gray-700 mb-1">
          Site/URL da loja/torrefação
        </label>
        <input
          id="roasterSite"
          type="url"
          {...register('roasterSite')}
          placeholder="https://www.torrefacao.com.br"
          className={`mt-1 block w-full rounded-md text-xs border text-gray-700 ${
            errors.roasterSite ? 'border-red-500' : 'border-gray-200'
          } p-2 focus:outline-none focus:shadow-outline`}
        />
        {errors.roasterSite && (
          <p className="mt-1 text-xs text-red-600">{errors.roasterSite.message}</p>
        )}
      </div>

      {/* Campo: Descrição do café */}
      <div>
        <label htmlFor="roasterDescription" className="block text-xs font-semibold text-gray-700 mb-1">
          Descrição do café
        </label>
        <textarea
          id="roasterDescription"
          {...register('roasterDescription')}
          ref={textareaRef}
          value={currentDescription}
          placeholder="Digite a descrição detalhada da torrefação..."
          rows={5}
          className={`mt-1 block w-full rounded-md text-xs text-gray-700 border ${
            errors.roasterDescription ? 'border-red-500' : 'border-gray-200'
          } p-2 resize-none focus:outline-none focus:shadow-outline overflow-y-hidden`}
          onInput={(e) => {
            setValue('roasterDescription', e.target.value);
            handleAdjustHeight(e.target);
          }}
        />
        {errors.roasterDescription && (
          <p className="mt-1 text-xs text-red-600">{errors.roasterDescription.message}</p>
        )}
      </div>
    </div>
  );
};

export default RoasterInfo;
