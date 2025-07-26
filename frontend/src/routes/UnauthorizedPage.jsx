// src/pages/UnauthorizedPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    // Ambil fungsi navigasi dari React Router
    const navigate = useNavigate();

    useEffect(() => {
        // Hapus token dan data user dari localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');

        // Alihkan pengguna ke halaman login setelah logout
        // 'replace: true' mencegah pengguna kembali ke halaman ini dengan tombol 'back'
        navigate('/', { replace: true });
    }, [navigate]); // Jalankan efek ini saat komponen dimuat

    // Tampilkan pesan sementara saat proses logout dan redirect berjalan
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Akses Ditolak</h2>
            <p>Anda tidak memiliki izin. Sedang mengalihkan ke halaman login...</p>
        </div>
    );
};

export default UnauthorizedPage;