import api from './axios.js';

export const dashboardApi={
    getStats:()=>api.get('/dashboard'),    
};