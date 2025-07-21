import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import LoginPage from "../auth/LoginPage";

// Role Route protection
import RoleRoute from "./RoleRoute";

// ADMIN
import DashboardAdmin from "../pages/admin/Dashboard";
import DataKaryawanAdmin from "../pages/admin/DataKaryawan";
import KeluargaKaryawanAdmin from "../pages/admin/KeluargaKaryawan";
import PencairanKeuanganAdmin from "../pages/admin/PencairanKeuangan";
import PengajuanKlaimAdmin from "../pages/admin/PengajuanKlaim";
import PersetujuanHRDAdmin from "../pages/admin/PersetujuanHRD";
import RiwayatKlaimAdmin from "../pages/admin/RiwayatKlaim";

// HRD
import DashboardHRD from "../pages/hrd/Dashboard";
import DataKaryawanHRD from "../pages/hrd/DataKaryawan";
import KeluargaKaryawanHRD from "../pages/hrd/KeluargaKaryawan";
import PencairanKeuanganHRD from "../pages/hrd/PencairanKeuangan";
import PengajuanKlaimHRD from "../pages/hrd/PengajuanKlaim";
import PersetujuanHRD from "../pages/hrd/PersetujuanHRD";
import RiwayatKlaimHRD from "../pages/hrd/RiwayatKlaim";

// KARYAWAN
import DashboardKaryawan from "../pages/karyawan/Dashboard";
import DataKaryawanKaryawan from "../pages/karyawan/DataKaryawan";
import KeluargaKaryawan from "../pages/karyawan/KeluargaKaryawan";
import PencairanKeuanganKaryawan from "../pages/karyawan/PencairanKeuangan";
import PengajuanKlaimKaryawan from "../pages/karyawan/PengajuanKlaim";
import PersetujuanHRDKaryawan from "../pages/karyawan/PersetujuanHRD";
import RiwayatKlaimKaryawan from "../pages/karyawan/RiwayatKlaim";

// KEUANGAN
import DashboardKeuangan from "../pages/keuangan/Dashboard";
import DataKaryawanKeuangan from "../pages/keuangan/DataKaryawan";
import KeluargaKaryawanKeuangan from "../pages/keuangan/KeluargaKaryawan";
import PencairanKeuangan from "../pages/keuangan/PencairanKeuangan";
import PengajuanKlaimKeuangan from "../pages/keuangan/PengajuanKlaim";
import PersetujuanHRDKeuangan from "../pages/keuangan/PersetujuanHRD";
import RiwayatKlaimKeuangan from "../pages/keuangan/RiwayatKlaim";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          <Route path="/admin/data-karyawan" element={<DataKaryawanAdmin />} />
          <Route path="/admin/keluarga-karyawan" element={<KeluargaKaryawanAdmin />} />
          <Route path="/admin/pencairan-keuangan" element={<PencairanKeuanganAdmin />} />
          <Route path="/admin/pengajuan-klaim" element={<PengajuanKlaimAdmin />} />
          <Route path="/admin/persetujuan-hrd" element={<PersetujuanHRDAdmin />} />
          <Route path="/admin/riwayat-klaim" element={<RiwayatKlaimAdmin />} />
        </Route>

        {/* HRD Routes */}
        <Route element={<RoleRoute allowedRoles={["hrd"]} />}>
          <Route path="/dashboard/hrd" element={<DashboardHRD />} />
          <Route path="/hrd/data-karyawan" element={<DataKaryawanHRD />} />
          <Route path="/hrd/keluarga-karyawan" element={<KeluargaKaryawanHRD />} />
          <Route path="/hrd/pencairan-keuangan" element={<PencairanKeuanganHRD />} />
          <Route path="/hrd/pengajuan-klaim" element={<PengajuanKlaimHRD />} />
          <Route path="/hrd/persetujuan-hrd" element={<PersetujuanHRD />} />
          <Route path="/hrd/riwayat-klaim" element={<RiwayatKlaimHRD />} />
        </Route>

        {/* Karyawan Routes */}
        <Route element={<RoleRoute allowedRoles={["karyawan"]} />}>
          <Route path="/dashboard/karyawan" element={<DashboardKaryawan />} />
          <Route path="/karyawan/data-karyawan" element={<DataKaryawanKaryawan />} />
          <Route path="/karyawan/keluarga-karyawan" element={<KeluargaKaryawan />} />
          <Route path="/karyawan/pencairan-keuangan" element={<PencairanKeuanganKaryawan />} />
          <Route path="/karyawan/pengajuan-klaim" element={<PengajuanKlaimKaryawan />} />
          <Route path="/karyawan/persetujuan-hrd" element={<PersetujuanHRDKaryawan />} />
          <Route path="/karyawan/riwayat-klaim" element={<RiwayatKlaimKaryawan />} />
        </Route>

        {/* Keuangan Routes */}
        <Route element={<RoleRoute allowedRoles={["keuangan"]} />}>
          <Route path="/dashboard/keuangan" element={<DashboardKeuangan />} />
          <Route path="/keuangan/data-karyawan" element={<DataKaryawanKeuangan />} />
          <Route path="/keuangan/keluarga-karyawan" element={<KeluargaKaryawanKeuangan />} />
          <Route path="/keuangan/pencairan-keuangan" element={<PencairanKeuangan />} />
          <Route path="/keuangan/pengajuan-klaim" element={<PengajuanKlaimKeuangan />} />
          <Route path="/keuangan/persetujuan-hrd" element={<PersetujuanHRDKeuangan />} />
          <Route path="/keuangan/riwayat-klaim" element={<RiwayatKlaimKeuangan />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default AppRoutes;