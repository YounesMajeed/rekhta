

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


import { HomeResponse, Word } from './types';

const API_PROXY = '/api/rekhta';

export const api = {
  getHome: async (): Promise<HomeResponse> => {
    const res = await fetch(`${API_PROXY}?action=home`);
    return res.json();
  },
  
  // Search returns the simple 'Word' type
  search: async (query: string): Promise<Word[]> => {
    const res = await fetch(`${API_PROXY}?action=search&q=${query}`);
    const data = await res.json();
    return data.WordList || [];
  },

  getDetails: async (id: string): Promise<any> => {
    const res = await fetch(`${API_PROXY}?action=detail&id=${id}`);
    return res.json();
  }
};