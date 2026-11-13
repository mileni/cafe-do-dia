// backend/utils/formatCoffee.js

/**
 * Converte o campo booleano 'coffeeTop' (0 ou 1) para um booleano JavaScript.
 * @param {Object} row - Objeto de linha do banco de dados.
 * @returns {Object} A linha formatada.
 */
const formatCoffeeRow = (row) => ({
    ...row,
    coffeeTop: row.coffeeTop === 1
});

module.exports = {
    formatCoffeeRow
};