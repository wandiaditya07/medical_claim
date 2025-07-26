// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [userData, setUserData] = useState({ name: '', role: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Ambil data dari localStorage saat komponen dimuat
        const name = localStorage.getItem('userName');
        const role = localStorage.getItem('userRole');
        if (name && role) {
            setUserData({ name, role });
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return (
        // Tambahkan className 'sticky-top' untuk membuatnya tetap di atas
        <nav className="navbar bg-light px-4 shadow-sm sticky-top">
            <div className="ms-auto d-flex align-items-center gap-3">

                {/* --- FUNGSI PENCARIAN --- */}
                <form onSubmit={handleSearch} className="d-flex align-items-center border rounded px-2 py-1">
                    <input 
                        className="form-control border-0 shadow-none" 
                        type="search" 
                        placeholder="Cari..." 
                        style={{ width: '160px' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-link p-0">
                        <FaSearch className="text-muted" />
                    </button>
                </form>
                
                <FaEnvelope className="text-muted" />
                <FaBell className="text-muted" />

                {/* --- DROPDOWN PENGGUNA DINAMIS --- */}
                <div className="dropdown">
                    <button className="btn dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="d-none d-md-flex flex-column text-end">
                            <strong>{userData.name}</strong>
                            <small className="text-muted">{userData.role}</small>
                        </div>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <Link to="/profile" className="dropdown-item">
                                Profil Saya
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;