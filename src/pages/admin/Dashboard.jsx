import React from "react";
import AppLayout from "../../layouts/AppLayout";
import SidebarAdmin from "../../components/admin/Sidebar";
import SummaryCard from "../../components/admin/SummaryCard";
import BarChartAdmin from "../../components/admin/BarChart";
import PieChartAdmin from "../../components/admin/PieChart";

// Dummy data untuk ringkasan
const summaryData = [
  {
    title: "Total Karyawan",
    value: "64",
    note: "3 karyawan baru bulan ini",
    color: "primary",
  },
  {
    title: "Total Klaim",
    value: "230",
    note: "+15 klaim minggu ini",
    color: "success",
  },
  {
    title: "Klaim Belum Diproses",
    value: "8",
    note: "Segera tindak lanjuti",
    color: "warning",
  },
  {
    title: "Total Dana Dikeluarkan",
    value: "Rp 120.000.000",
    note: "Data hingga Juli 2025",
    color: "secondary",
  },
];

// Dummy data klaim terbaru
const klaimTerbaru = [
  { id: "#ADM001", tanggal: "2025-07-19", status: "Disetujui" },
  { id: "#ADM002", tanggal: "2025-07-18", status: "Diproses" },
  { id: "#ADM003", tanggal: "2025-07-16", status: "Ditolak" },
  { id: "#ADM004", tanggal: "2025-07-15", status: "Disetujui" },
];

const DashboardAdmin = () => {
  return (
    <AppLayout sidebar={SidebarAdmin}>
      <div className="container-fluid py-4 px-3">
        <h4 className="fw-bold mb-4">Selamat Datang, Admin!</h4>

        {/* Ringkasan Data */}
        <div className="row g-4 mb-4">
          {summaryData.map((item, idx) => (
            <div className="col-md-3" key={idx}>
              <SummaryCard {...item} />
            </div>
          ))}
        </div>

        {/* Grafik */}
        <div className="row g-4 mb-4">
          <div className="col-md-8">
            <div className="card shadow rounded-4 p-3">
              <BarChartAdmin />
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow rounded-4 p-3">
              <PieChartAdmin />
            </div>
          </div>
        </div>

        {/* Klaim Terbaru + Pengingat */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow rounded-4 p-3">
              <h6 className="mb-3 fw-semibold">Klaim Terbaru</h6>
              <ul className="list-group list-group-flush">
                {klaimTerbaru.map((klaim, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{klaim.id}</strong><br />
                      <small>{klaim.tanggal}</small>
                    </div>
                    <span className={`badge bg-${klaim.status === "Disetujui" ? "success" : klaim.status === "Diproses" ? "warning text-dark" : "danger"}`}>
                      {klaim.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow rounded-4 p-3">
              <h6 className="mb-3 fw-semibold">Pengingat Admin</h6>
              <div className="alert alert-info rounded-3 mb-2">
                🔄 *Review laporan bulanan sebelum tanggal 25!*
              </div>
              <div className="alert alert-danger rounded-3 mb-0">
                ⏰ *Cek klaim yang belum diproses hari ini.*
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardAdmin;
