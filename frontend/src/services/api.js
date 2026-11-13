import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createCoffee = async (coffeeData) => {
  try {
    const response = await api.post('/coffees', coffeeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar café:', error);
    throw error;
  }
};

export const getAllCoffees = async () => {
  try {
    const response = await api.get('/coffees');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cafés:', error);
    throw error;
  }
};

export const updateCoffee = async (id, coffeeData) => {
  try {
    const response = await api.put(`/coffees/${id}`, coffeeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar café com ID ${id}:`, error);
    throw error;
  }
};

export const deleteCoffee = async (id) => {
  try {
    const response = await api.delete(`/coffees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar café com ID ${id}:`, error);
    throw error;
  }
};

export const createDayCoffee = async (dayCoffeeData) => {
  try {
    const response = await api.post('/day-coffees', dayCoffeeData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar café do dia:', error);
    throw error;
  }
};

export const getAllDayCoffees = async () => {
  try {
    const response = await api.get('/day-coffees');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cafés do dia:', error);
    throw error;
  }
};

export const updateDayCoffee = async (dayCoffeeId, data) => {
  try {
    const response = await api.put(`/day-coffees/${dayCoffeeId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar café do dia com ID ${dayCoffeeId}:`, error);
    throw error;
  }
};

export const deleteDayCoffee = async (dayCoffeeId) => {
  try {
    const response = await api.delete(`/day-coffees/${dayCoffeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar café do dia com ID ${dayCoffeeId}:`, error);
    throw error;
  }
};