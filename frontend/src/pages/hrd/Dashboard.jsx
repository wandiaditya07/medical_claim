import React, { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import SidebarHRD from "../../components/hrd/Sidebar";
import SummaryCard from "../../components/hrd/SummaryCard";
import BarChartHRD from "../../components/hrd/BarChart";
import PieChartHRD from "../../components/hrd/PieChart";
import axios from "axios"; // Import axios
import apiClient from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentClients, setRecentClients] = useState([]); // Tetap ada jika ingin di masa depan
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
        
        const [summaryRes, barChartRes, pieChartRes] = await Promise.all([
            apiClient.get('/reports/hrd-summary'),
            apiClient.get('/reports/claims-per-month'),
            apiClient.get('/reports/claims-status')
        ]);

        // 4. Format data summary SEBELUM disimpan ke state
        const formattedSummary = summaryRes.data.summaryData.map(item => {
            if (item.title.includes('Biaya Klaim')) {
                return { ...item, value: formatCurrency(item.value) };
            }
            return item;
        });

        setSummaryData(formattedSummary);
        setRecentEmployees(summaryRes.data.recentEmployees);
        setRecentClients(summaryRes.data.recentClients);
        
        setBarChartData(barChartRes.data);
        setPieChartData(pieChartRes.data);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(err.response?.data?.message || "Gagal memuat data dashboard.");
        } finally {
            setLoading(false);
        }
     };

    fetchDashboardData();
  }, []); // [] agar hanya berjalan sekali saat komponen mount

  if (loading) {
    return (
      <AppLayout sidebar={SidebarHRD}>
        <div className="container-fluid py-4 text-center">
          <p>Memuat data dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout sidebar={SidebarHRD}>
        <div className="container-fluid py-4 text-center">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </div>
      </AppLayout>
    );
  }


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
            <BarChartHRD data={barChartData} /> {/* Pass data ke BarChartHRD */}
          </div>
          <div className="col-lg-4">
            <PieChartHRD data={pieChartData} /> {/* Pass data ke PieChartHRD */}
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom fw-bold">Karyawan Terbaru</div>
              <ul className="list-group list-group-flush">
                {recentEmployees.length > 0 ? (
                    recentEmployees.map((emp, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between">
                            <span>{emp.name}</span>
                            <small className="text-muted">{emp.role}</small>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-center text-muted">Tidak ada data karyawan terbaru.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom fw-bold">Klien Terbaru</div>
              <ul className="list-group list-group-flush">
                {/* Asumsi recentClients akan diisi dari backend jika ada sumbernya */}
                {recentClients.length > 0 ? (
                    recentClients.map((client, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between">
                            <span>{client.name}</span>
                            <small className="text-muted">{client.project}</small>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-center text-muted">Tidak ada data klien terbaru.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;