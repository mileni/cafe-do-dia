// frontend/src/utils/formatCurrencyBR.js

/**
 * Formata um valor numérico ou string para moeda brasileira (R$ X.XXX,XX)
 * Ex: "1234" => "R$ 12,34" -> "R$ 1.234,00" etc.
 */

export function formatCurrencyBR(value) {
  if (!value) return '';

  const numericValue = value.toString().replace(/\D/g, '');

  const number = parseFloat(numericValue) / 100;

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}