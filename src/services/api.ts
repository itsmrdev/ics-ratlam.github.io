import axios from 'axios';
import { LoginResponse, Item } from '../types';

export const api = axios.create({
  baseURL: 'https://myserver',
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const getItems = async (): Promise<Item[]> => {
  //const response = await api.get('/item');
  return [{id:"2233",name:"Coffee",detail:"Hot Coffee",price:"30",category:"Beverages",unique_number:"12"},
          {id:"231",name:"Cold Coffee",detail:"Iced Coffee",price:"60",category:"Beverages",unique_number:"13"}];
  // return response.data.data;
};