import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/dons";

export const fetchDons = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDon = async (donData) => {
  const response = await axios.post(API_URL, donData);
  return response.data;
};

export const updateDon = async (id, donData) => {
  const response = await axios.put(`${API_URL}/${id}`, donData);
  return response.data;
};

export const deleteDon = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const reserverDon = async (id, userId) => {
  const response = await axios.put(`${API_URL}/${id}/reserver`, { reserve_par: userId });
  return response.data;
};
