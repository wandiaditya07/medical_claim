// src/components/karyawan/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaFileMedical, FaHistory, FaSignOutAlt } from "react-icons/fa";

const SidebarKaryawan = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            window.location.href = '/';
        }
    };

    const linkClass = ({ isActive }) =>
        `nav-link mb-2 d-flex align-items-center ${isActive ? 'active fw-bold text-dark' : 'text-secondary'}`;

    return (
        <div className="d-flex flex-column justify-content-between p-4 bg-white border-end shadow-sm" style={{ width: '250px', height: '100vh', position: 'sticky', top: 0 }}>
            <div>
                <h4 className="fw-bold text-primary mb-4">ClaimApp</h4>
                <div className="text-uppercase text-muted small mb-2">Main</div>
                <ul className="nav flex-column mb-3">
                    <li className="nav-item">
                        <NavLink to="/dashboard/karyawan" className={linkClass}><FaHome className="me-2" /> Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/profile" className={linkClass}><FaUser className="me-2" /> Profil Saya</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/karyawan/data-keluarga" className={linkClass}><FaUsers className="me-2" /> Data Keluarga</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/karyawan/pengajuan-klaim" className={linkClass}><FaFileMedical className="me-2" /> Pengajuan Klaim</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/karyawan/riwayat-klaim" className={linkClass}><FaHistory className="me-2" /> Riwayat Klaim</NavLink>
                    </li>
                </ul>
            </div>
            <div>
                <button onClick={handleLogout} className="btn btn-danger w-100 d-flex align-items-center justify-content-center">
                    <FaSignOutAlt className="me-2" /> Logout
                </button>
            </div>
        </div>
    );
};

export default SidebarKaryawan;