// src/auth/PublicRoute.jsx
import axios from 'axios';

import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole'); // Anda harus menyimpan role saat login

    if (token) {
        // Jika token ada, alihkan ke dashboard berdasarkan peran
        if (userRole === 'HRD') {
            return <Navigate to="/dashboard/hrd" replace />;
        } else if (userRole === 'KARYAWAN') {
            return <Navigate to="/dashboard/karyawan" replace />;
        } else if (userRole === 'KEUANGAN') {
            return <Navigate to="/dashboard/keuangan" replace />;
        }
        // Fallback jika peran tidak dikenali
        return <Navigate to="/hrd/dashboard" replace />;
    }

    // Jika tidak ada token, izinkan akses ke halaman login
    return children;
};

export default PublicRoute;