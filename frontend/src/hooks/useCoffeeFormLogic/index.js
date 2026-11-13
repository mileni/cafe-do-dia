// frontend/src/hooks/useCoffeeFormLogic/index.js

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { dataLists } from './constants';
import { parseBackendDate, formatInitialFormData } from './utils';
import { useAutoResizeTextareas, useImagePreview } from './useEffects';

const useCoffeeFormLogic = (initialData, onSubmit) => {
  const formattedData = formatInitialFormData(initialData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues: formattedData });

  const textareaRef = useRef(null);
  const observationTextareaRef = useRef(null);

  const roasterDescription = watch('roasterDescription') || '';
  const coffeeObservationValue = watch('coffeeObservation') || '';
  const coffeePrice = watch('coffeePrice') || '';

  const [grindValue, setGrindValue] = useState(formattedData.coffeeGrind);
  const [imagePreview, setImagePreview] = useState(null);

  // Registra os campos do formulário manualmente
  useEffect(() => {
    register('roasterDescription');
    register('coffeeObservation');
    register('coffeePrice');
  }, [register]);

  // Reset do formulário quando os dados iniciais mudarem
  useEffect(() => {
    reset(formatInitialFormData(initialData));
  }, [initialData, reset]);

  // Sincroniza grindValue com RHF
  useEffect(() => {
    setValue('coffeeGrind', grindValue);
  }, [grindValue, setValue]);

  // Efeitos customizados separados
  useAutoResizeTextareas(
    { textareaRef, observationTextareaRef },
    { roasterDescription, coffeeObservationValue }
  );
  useImagePreview(initialData, setImagePreview);

  return {
    register,
    handleSubmit: () => handleSubmit(onSubmit),
    control,
    errors,
    setValue,
    watch,
    grindValue,
    setGrindValue,
    imagePreview,
    setImagePreview,
    dataLists,
    parseBackendDate,
    textareaRef,              // ref para textarea roasterDescription
    roasterDescription,       // valor atual do roasterDescription
    observationTextareaRef,   // ref para textarea coffeeObservation
    coffeeObservationValue,   // valor atual do coffeeObservation
    coffeePrice,              // valor atual do coffeePrice
  };
};

export default useCoffeeFormLogic;
