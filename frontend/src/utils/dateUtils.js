// frontend/src/utils/dateUtil.js
/**
 * Converte um valor de data (Date object ou string ISO YYYY-MM-DD) para o formato de exibição português DD/MM/YYYY.
 * Esta função é útil para exibir datas em listas ou textos.
 * @param {Date | string} value - O valor da data a ser formatado.
 * @returns {string} A data formatada em DD/MM/YYYY ou uma string vazia se inválido.
 */
export const toDisplayFormat = (value) => {
    if (!value) return '';
    let date;
    
    // Tenta converter o valor para um objeto Date
    if (value instanceof Date) {
        date = value;
    } else if (typeof value === 'string') {
        // Se for string ISO (YYYY-MM-DD), parseia corretamente
        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Adiciona 'T00:00:00' para evitar problemas de fuso horário (timezone) com datas ISO puras
            date = new Date(value + 'T00:00:00'); 
        } else {
            date = new Date(value);
        }
    } else {
        return '';
    }

    // Retorna a data no formato DD/MM/YYYY se for válida
    if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; 
    }
    return '';
};

/**
 * Converte a string de data no formato de exibição DD/MM/YYYY (do input manual, se usado) 
 * para o formato ISO YYYY-MM-DD (para armazenamento no backend).
 * Esta função é menos crucial com o DatePicker, mas é mantida por completude.
 * @param {string} displayValue - A string de data no formato DD/MM/YYYY.
 * @returns {string} A data formatada em YYYY-MM-DD ou o valor original se o formato for inválido.
 */
export const toStorageFormat = (displayValue) => {
    if (!displayValue || displayValue.length !== 10) return displayValue;

    const parts = displayValue.split('/');
    // Verifica se o formato é DD/MM/YYYY
    if (parts.length === 3) {
        const [day, month, year] = parts;
        // Retorna o formato ISO YYYY-MM-DD
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return displayValue; // Retorna o valor original se o formato for desconhecido/inválido
};


/**
 * Converte a string ISO (YYYY-MM-DD) armazenada no react-hook-form para um objeto Date.
 * O objeto Date é o formato esperado pela prop 'selected' do DatePicker.
 * @param {string} isoString - O valor da data no formato YYYY-MM-DD.
 * @returns {Date | null} Um objeto Date ou null se a string for inválida/vazia.
 */
export const toDatePickerFormat = (isoString) => {
  // Verifica se o valor é nulo, não é string, ou não está no formato ISO esperado
  if (!isoString || typeof isoString !== 'string' || !isoString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return null;
  }
  
  // Adiciona T00:00:00 para garantir que o Date seja criado no início do dia
  // e evite problemas de fuso horário, que é a melhor prática para datas puras.
  const date = new Date(isoString + 'T00:00:00');
  
  // Retorna o objeto Date se for válido, ou null
  return isNaN(date.getTime()) ? null : date;
};