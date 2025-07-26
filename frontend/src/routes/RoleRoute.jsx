// src/routes/RoleRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("userRole");

  // 1. Cek jika pengguna belum login
  if (!token) {
    // Jika tidak ada token, wajib kembali ke halaman login
    return <Navigate to="/" replace />;
  }

  // 2. Cek jika peran pengguna diizinkan
  // Pengecekan 'allowedRoles' ditambahkan untuk mencegah error jika prop tidak ada
  if (userRole && allowedRoles && allowedRoles.includes(userRole)) {
    // ✅ Jika diizinkan, tampilkan halaman yang dituju
    return <Outlet />;
  }

  // 3. Jika sudah login tapi peran tidak cocok, arahkan ke halaman unauthorized
  // Ini lebih aman daripada mengarahkan ke dashboard masing-masing
  console.warn(
    `Unauthorized Access: User with role "${userRole}" tried to access a route restricted to "${allowedRoles.join(", ")}".`
  );
  return <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;