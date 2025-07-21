import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("role");

  // ⛔ Kalau belum login (ga ada role di localStorage)
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // ❌ Kalau role-nya salah
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole ? `dashboard/${userRole}` : ""}`} replace />;
  }

  // ✅ Role cocok, terusin ke halaman
  return <Outlet />;
};

export default RoleRoute;
