import React from "react";
import AppLayout from "../../layouts/AppLayout";
import SidebarHRD from "../../components/hrd/Sidebar";
import SummaryCard from "../../components/hrd/SummaryCard";
import BarChartHRD from "../../components/hrd/BarChart";
import PieChartHRD from "../../components/hrd/PieChart";

const DashboardHRD = () => {
  const summaryData = [
    {
      title: 'Total Karyawan',
      value: '64',
      note: '+5% dari bulan lalu',
      color: 'success'
    },
    {
      title: 'Klaim Masuk',
      value: '536',
      note: '+10% klaim naik',
      color: 'info'
    },
    {
      title: 'Klaim Disetujui',
      value: '480',
      note: '+12% disetujui',
      color: 'primary'
    },
    {
      title: 'Total Biaya Klaim',
      value: 'Rp 55.000.000',
      note: 'Bulan ini',
      color: 'secondary'
    }
  ];

  const recentEmployees = [
    { name: 'Ahmad Fauzi', role: 'Staff IT' },
    { name: 'Dina Safira', role: 'HRD' },
    { name: 'Rama Aditya', role: 'Marketing' },
    { name: 'Lina Permata', role: 'Finance' }
  ];

  const recentClients = [
    { name: 'PT Maju Jaya', project: 'Klaim Asuransi' },
    { name: 'CV Solusi Hebat', project: 'Data Payroll' },
    { name: 'PT Indah Makmur', project: 'Penggajian Karyawan' }
  ];

  return (
    <AppLayout sidebar={SidebarHRD}>
      <div className="container-fluid py-4">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Dashboard HRD</h4>
          <p className="text-muted m-0">Selamat datang kembali di dashboard HRD!</p>
        </div>

        <div className="row g-4 mb-4">
          {summaryData.map((item, idx) => (
            <div className="col-md-6 col-xl-3" key={idx}>
              <SummaryCard {...item} />
            </div>
          ))}
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <BarChartHRD />
          </div>
          <div className="col-lg-4">
            <PieChartHRD />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom fw-bold">Karyawan Terbaru</div>
              <ul className="list-group list-group-flush">
                {recentEmployees.map((emp, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between">
                    <span>{emp.name}</span>
                    <small className="text-muted">{emp.role}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom fw-bold">Klien Terbaru</div>
              <ul className="list-group list-group-flush">
                {recentClients.map((client, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between">
                    <span>{client.name}</span>
                    <small className="text-muted">{client.project}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardHRD;