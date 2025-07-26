// src/components/DynamicSidebar.jsx

import React from 'react';

// Import semua komponen sidebar Anda
import SidebarHRD from './hrd/Sidebar';
import SidebarKaryawan from './karyawan/Sidebar'; // Asumsi nama file
import SidebarKeuangan from './keuangan/Sidebar'; // Asumsi nama file

const DynamicSidebar = () => {
    const userRole = localStorage.getItem('userRole');

    // Tentukan komponen sidebar mana yang akan dirender
    switch (userRole) {
        case 'HRD':
            return <SidebarHRD />;
        case 'KARYAWAN':
            return <SidebarKaryawan />;
        case 'KEUANGAN':
            return <SidebarKeuangan />;
        default:
            // Fallback jika peran tidak dikenali atau tidak ada
            // Bisa juga return null atau komponen sidebar default
            return null; 
    }
};

export default DynamicSidebar;