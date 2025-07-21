import React from 'react';
import { FaBell, FaEnvelope, FaSearch, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar bg-light px-4 shadow-sm">
      <div className="ms-auto d-flex align-items-center gap-3">

        <div className="d-flex align-items-center border rounded px-2 py-1">
          <input className="form-control border-0 shadow-none" type="search" placeholder="Search..." style={{ width: '160px' }} />
          <FaSearch className="text-muted" />
        </div>
          <FaEnvelope className="text-muted" />
          <FaBell className="text-muted" />

        <div className="dropdown">
          <button className="btn dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
            <div className="d-none d-md-flex flex-column text-start">
              <strong>Wandi Aditya</strong>
              <small className="text-muted">wandiaditya@gmail.com</small>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li className="dropdown-item">
              <div>
                <strong>Fasya Hasna Aidah</strong>
                <div className="text-muted small">fasyahasnaaidah@gmail.com</div>
              </div>
              <div>
                <strong>Andreas Julianto</strong>
                <div className="text-muted small">andreasjulianto@gmail.com</div>
              </div>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-primary"> <FaUserPlus className="me-2" /> Add New Account </button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;