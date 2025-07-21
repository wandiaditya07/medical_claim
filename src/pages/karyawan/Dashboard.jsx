import React from "react";
import AppLayout from "../../layouts/AppLayout";
import SidebarKaryawan from "../../components/karyawan/Sidebar";
import SummaryCard from "../../components/karyawan/SummaryCard";
import BarChartKaryawan from "../../components/karyawan/BarChart";
import PieChartKaryawan from "../../components/karyawan/PieChart";

// Dummy data
const summaryData = [
  {
    title: "Total Klaim Saya",
    value: "16",
    note: "+2 klaim bulan ini",
    color: "success",
  },
  {
    title: "Klaim Disetujui",
    value: "12",
    note: "+1 minggu ini",
    color: "success",
  },
  {
    title: "Klaim Ditolak",
    value: "1",
    note: "Tetap semangat!",
    color: "danger",
  },
  {
    title: "Dana Dikembalikan",
    value: "Rp 3.500.000",
    note: "Update terakhir bulan ini",
    color: "secondary",
  },
];

// Dummy klaim
const klaimTerbaru = [
  { id: "#KLM001", tanggal: "2025-07-18", status: "Disetujui" },
  { id: "#KLM002", tanggal: "2025-07-17", status: "Diproses" },
  { id: "#KLM003", tanggal: "2025-07-15", status: "Ditolak" },
  { id: "#KLM004", tanggal: "2025-07-12", status: "Disetujui" },
  { id: "#KLM005", tanggal: "2025-07-10", status: "Diproses" },
];

const DashboardKaryawan = () => {
  return (
    <AppLayout sidebar={SidebarKaryawan}>
      <div className="container-fluid py-4 px-3">
        <h4 className="fw-bold mb-4">Selamat Datang, Karyawan Hebat!</h4>

        {/* Ringkasan Klaim */}
        <div className="row g-4 mb-4">
          {summaryData.map((item, idx) => (
            <div className="col-md-3" key={idx}>
              <SummaryCard {...item} />
            </div>
          ))}
        </div>

        {/* Bagian Grafik */}
        <div className="row g-4 mb-4">
          <div className="col-md-8">
            <div className="card shadow rounded-4 p-3">
              <BarChartKaryawan />
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow rounded-4 p-3">
              <PieChartKaryawan />
            </div>
          </div>
        </div>

        {/* Klaim Terbaru + Pengumuman */}
        <div className="row g-4">
          {/* Klaim Terbaru */}
          <div className="col-md-6">
            <div className="card shadow rounded-4 p-3">
              <h6 className="mb-3 fw-semibold">Klaim Terbaru</h6>
              <ul className="list-group list-group-flush">
                {klaimTerbaru.map((klaim, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{klaim.id}</strong> <br />
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

          {/* Pengumuman */}
          <div className="col-md-6">
            <div className="card shadow rounded-4 p-3">
              <h6 className="mb-3 fw-semibold">Pengumuman</h6>
              <div className="alert alert-info rounded-3 mb-2">
                📢 *Update sistem klaim mulai 1 Agustus 2025.*
              </div>
              <div className="alert alert-warning rounded-3 mb-0">
                ⚠️ *Jangan lupa upload bukti transfer untuk klaim bulan ini.*
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardKaryawan;