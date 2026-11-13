// frontend/src/hooks/useCoffeeFormLogic/utils.js

import { parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para parse de datas vindas do backend
export const parseBackendDate = (dateString) => {
  if (!dateString) return null;
  const parsed = parse(dateString, 'dd/MM/yyyy', new Date(), { locale: ptBR });
  return parsed instanceof Date && !isNaN(parsed) ? parsed : null;
};

// Formata os valores iniciais para usar como defaultValues no RHF
export const formatInitialFormData = (initialData) => ({
  ...initialData,
  coffeeTop: initialData.coffeeTop || false,
  coffeeRoastDate: initialData.coffeeRoastDate
    ? new Date(initialData.coffeeRoastDate.split('/').reverse().join('-'))
    : null,
  coffeePurchaseDate: initialData.coffeePurchaseDate
    ? new Date(initialData.coffeePurchaseDate.split('/').reverse().join('-'))
    : null,
  roasterDescription: initialData.roasterDescription || '',
  coffeeObservation: initialData.coffeeObservation || '',
  coffeeGrind: initialData.coffeeGrind || 7,
  coffeePrice: initialData.coffeePrice || '',
});
