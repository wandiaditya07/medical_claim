import React from "react";
import AppLayout from "../../layouts/AppLayout";
import SidebarKeuangan from "../../components/keuangan/Sidebar";
import SummaryCard from "../../components/keuangan/SummaryCard";
import BarChartKeuangan from "../../components/keuangan/BarChart";
import PieChartKeuangan from "../../components/keuangan/PieChart";

const summaryData = [
  {
    title: "Total Dana Dicairkan",
    value: "Rp 8.250.000",
    note: "+Rp 1.000.000 minggu ini",
    color: "success",
  },
  {
    title: "Jumlah Klaim Disetujui",
    value: "27",
    note: "+5 minggu ini",
    color: "success",
  },
  {
    title: "Klaim Belum Cair",
    value: "4",
    note: "Perlu diproses secepatnya",
    color: "warning",
  },
  {
    title: "Dana Tertolak",
    value: "Rp 750.000",
    note: "Dari 3 klaim",
    color: "danger",
  },
];

const latestClaims = [
  { nama: "Rizky Putra", nominal: "Rp 500.000", status: "Menunggu", tanggal: "18 Juli 2025" },
  { nama: "Alya Lestari", nominal: "Rp 250.000", status: "Disetujui", tanggal: "17 Juli 2025" },
  { nama: "Dimas Prasetyo", nominal: "Rp 1.000.000", status: "Dicairkan", tanggal: "16 Juli 2025" },
  { nama: "Siska Aulia", nominal: "Rp 300.000", status: "Ditolak", tanggal: "15 Juli 2025" },
];

const DashboardKeuangan = () => {
  return (
    <AppLayout sidebar={SidebarKeuangan}>
      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4">Selamat Datang, Tim Keuangan!</h4>

        {/* Summary Cards */}
        <SummaryCard data={summaryData} />

        {/* Charts */}
        <div className="row mt-4">
          <div className="col-lg-8 mb-4">
            <BarChartKeuangan />
          </div>
          <div className="col-lg-4 mb-4">
            <PieChartKeuangan />
          </div>
        </div>

        {/* Tabel Klaim Terbaru */}
        <div className="card mb-4">
          <div className="card-header fw-semibold">Klaim Terbaru</div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nama Karyawan</th>
                  <th>Nominal</th>
                  <th>Status</th>
                  <th>Tanggal Pengajuan</th>
                </tr>
              </thead>
              <tbody>
                {latestClaims.map((claim, index) => (
                  <tr key={index}>
                    <td>{claim.nama}</td>
                    <td>{claim.nominal}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>{claim.tanggal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rekap Bulanan */}
        <div className="card">
          <div className="card-header fw-semibold">Rekap Bulanan (Simulasi)</div>
          <div className="card-body">
            <p>Total Klaim: 45</p>
            <p>Total Dana Dicairkan: Rp 12.500.000</p>
            <p>Dana Ditolak: Rp 1.250.000</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Fungsi bantu untuk badge status
function getStatusColor(status) {
  switch (status) {
    case "Menunggu":
      return "warning";
    case "Disetujui":
      return "primary";
    case "Dicairkan":
      return "success";
    case "Ditolak":
      return "danger";
    default:
      return "secondary";
  }
}

export default DashboardKeuangan;