import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Protected Route
import PublicRoute from "../auth/PublicRoute";

// Auth
import LoginPage from "../auth/LoginPage";

// Role Route protection
import RoleRoute from "./RoleRoute";

// HRD
import DashboardHRD from "../pages/hrd/Dashboard";
import DataKaryawanHRD from "../pages/hrd/DataKaryawan";
import AktivasiKaryawan from "../pages/hrd/AktivasiKaryawan";
import PersetujuanHRD from "../pages/hrd/PersetujuanHRD";
import HistoryHRD from "../pages/hrd/HistoryPage";

// KARYAWAN
import DashboardKaryawan from "../pages/karyawan/Dashboard";
import DataKeluarga from "../pages/karyawan/DataKeluarga";
import PengajuanKlaimKaryawan from "../pages/karyawan/PengajuanKlaim";
import RiwayatKlaimKaryawan from "../pages/karyawan/RiwayatKlaim";


// KEUANGAN
import DashboardKeuangan from "../pages/keuangan/Dashboard";
import PencairanKeuangan from "../pages/keuangan/PencairanKeuangan";
import RiwayatPembayaran from '../pages/keuangan/RiwayatPembayaran';

//Unauthorized
import UnauthorizedPage from "./UnauthorizedPage";

//Global
import ProfilePage from "../pages/global/ProfilePage";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* HRD Routes */}
        <Route element={<RoleRoute allowedRoles={["HRD"]} />}>
          <Route path="/dashboard/hrd" element={<DashboardHRD />} />
          <Route path="/hrd/data-karyawan" element={<DataKaryawanHRD />} />
          <Route path="/hrd/aktivasi-karyawan" element={<AktivasiKaryawan />} />
          <Route path="/hrd/persetujuan-hrd" element={<PersetujuanHRD />} />
          <Route path="/hrd/history-hrd" element={<HistoryHRD />} />
        </Route>

        {/* Karyawan Routes */}
        <Route element={<RoleRoute allowedRoles={["KARYAWAN"]} />}>
          <Route path="/dashboard/karyawan" element={<DashboardKaryawan />} />
          <Route path="/karyawan/data-keluarga" element={<DataKeluarga />} />
          <Route path="/karyawan/pengajuan-klaim" element={<PengajuanKlaimKaryawan />} />
          <Route path="/karyawan/riwayat-klaim" element={<RiwayatKlaimKaryawan />} />
        </Route>

        {/* Keuangan Routes */}
        <Route element={<RoleRoute allowedRoles={["KEUANGAN"]} />}>
          <Route path="/dashboard/keuangan" element={<DashboardKeuangan />} />
          <Route path="/keuangan/pencairan-keuangan" element={<PencairanKeuangan />} />
          <Route path="/keuangan/riwayat-pembayaran" element={<RiwayatPembayaran />} />
        </Route>

        {/* Profile Page */}
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;