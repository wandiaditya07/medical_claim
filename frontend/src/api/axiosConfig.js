// src/api/axiosConfig.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// =================================================================
// INTERCEPTOR REQUEST (Dijalankan SEBELUM setiap request dikirim)
// =================================================================
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('jwtToken');
    
    // Jika token ada, tambahkan header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config; // Lanjutkan request dengan config yang sudah diubah
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =================================================================
// INTERCEPTOR RESPONSE (Dijalankan SETELAH setiap response diterima)
// =================================================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Cek jika error 401 (Unauthorized) atau 403 (Forbidden)
    if (error.response && [401, 403].includes(error.response.status)) {
      console.log('Token tidak valid atau sudah habis. Melakukan logout...');
      
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');

      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;