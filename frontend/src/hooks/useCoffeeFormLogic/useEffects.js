// frontend/src/hooks/useCoffeeFormLogic/useEffects.js

import { useEffect } from 'react';

// Autoajuste de altura dos textareas
export const useAutoResizeTextareas = (refs, values) => {
  const { textareaRef, observationTextareaRef } = refs;
  const { roasterDescription, coffeeObservationValue } = values;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [roasterDescription]);

  useEffect(() => {
    if (observationTextareaRef.current) {
      observationTextareaRef.current.style.height = 'auto';
      observationTextareaRef.current.style.height = `${observationTextareaRef.current.scrollHeight}px`;
    }
  }, [coffeeObservationValue]);
};

// Carrega a imagem do backend para preview
export const useImagePreview = (initialData, setImagePreview) => {
  useEffect(() => {
    if (initialData?.coffeeImage && typeof initialData.coffeeImage === 'string') {
      const backendURL = 'http://localhost:3001';
      const isAbsolute = initialData.coffeeImage.startsWith('http');
      setImagePreview(isAbsolute ? initialData.coffeeImage : `${backendURL}${initialData.coffeeImage}`);
    }
  }, [initialData, setImagePreview]);
};
