// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Boards
  getBoard: (id) => axios.get(`${API_URL}/boards/${id}`),

  // Lists
  createList: (data) => axios.post(`${API_URL}/lists`, data),
  reorderLists: (data) => axios.put(`${API_URL}/lists/reorder`, data), // Expects { lists: [{id, position}] }

  // Cards
  createCard: (data) => axios.post(`${API_URL}/cards`, data),
  moveCard: (id, data) => axios.put(`${API_URL}/cards/move/${id}`, data), // Expects { newListId }
  reorderCards: (data) => axios.put(`${API_URL}/cards/reorder`, data),    // Expects { cards: [{id, position}] }
};