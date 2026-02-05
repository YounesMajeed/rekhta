

// import { HomeResponse, WordItem } from './types';

// const API_PROXY = '/api/rekhta';

// export const api = {
//   // Update the return type to HomeResponse
//   getHome: async (): Promise<HomeResponse> => {
//     const res = await fetch(`${API_PROXY}?action=home`);
//     return res.json();
//   },
  
//   // Search stays the same (it uses a different endpoint structure)
//   search: async (query: string): Promise<WordItem[]> => {
//     const res = await fetch(`${API_PROXY}?action=search&q=${query}`);
//     const data = await res.json();
//     return data.WordList || [];
//   },

//   getDetails: async (id: string): Promise<any> => {
//     const res = await fetch(`${API_PROXY}?action=detail&id=${id}`);
//     return res.json();
//   }
// };


import { HomeResponse, Word, DetailedWordResponse } from './types';
import apiClient from './apiClient';

export const api = {
  getHome: async (): Promise<HomeResponse> => {
    const { data } = await apiClient.get('?action=home');
    return data;
  },

  search: async (query: string): Promise<Word[]> => {
    const { data } = await apiClient.get('?action=search&q=' + encodeURIComponent(query));
    return data.WordList || [];
  },

  getDetails: async (id: string): Promise<DetailedWordResponse> => {
    const { data } = await apiClient.get('?action=detail&id=' + encodeURIComponent(id));
    return data;
  },
};