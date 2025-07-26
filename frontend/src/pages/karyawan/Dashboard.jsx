import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKaryawan from '../../components/karyawan/Sidebar';
import SummaryCard from '../../components/karyawan/SummaryCard';
import BarChartKaryawan from '../../components/karyawan/BarChart';
import PieChartKaryawan from '../../components/karyawan/PieChart';
import { Alert, Card } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [recentClaims, setRecentClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/karyawan/dashboard-summary');
                const data = response.data;
                
                setSummaryData([
                    { title: "Sisa Plafon Tahun Ini", value: formatCurrency(data.summaryData.remainingLimit) },
                    { title: "Total Klaim Diajukan", value: data.summaryData.totalClaims },
                    { title: "Total Dana Diterima", value: formatCurrency(data.summaryData.totalReimbursed) }
                ]);

                setRecentClaims(data.recentClaims);

            } catch (err) {
                setError('Gagal memuat data dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <AppLayout sidebar={SidebarKaryawan}>
                <div className="text-center p-4">Memuat...</div>
            </AppLayout>
        );
    }
    
    if (error) {
        return (
            <AppLayout sidebar={SidebarKaryawan}>
                <Alert variant="danger" className="m-4">{error}</Alert>
            </AppLayout>
        );
    }

    return (
        <AppLayout sidebar={SidebarKaryawan}>
            <div className="container-fluid py-4 px-3">
                <h4 className="fw-bold mb-4">Dashboard</h4>
                
                <div className="row g-4 mb-4">
                    {summaryData.map((item, idx) => (
                        <div className="col-md-4" key={idx}>
                            <SummaryCard title={item.title} value={item.value} />
                        </div>
                    ))}
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <Card className="shadow-sm border-0 rounded-4 p-3 h-100">
                            <BarChartKaryawan />
                        </Card>
                    </div>
                    <div className="col-lg-4">
                        <Card className="shadow-sm border-0 rounded-4 p-3 h-100">
                            <PieChartKaryawan />
                        </Card>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <Card className="shadow-sm border-0 rounded-4 p-3">
                            <h6 className="mb-3 fw-semibold">5 Klaim Terakhir</h6>
                            <ul className="list-group list-group-flush">
                                {recentClaims.length > 0 ? recentClaims.map((claim) => (
                                    <li key={claim.claim_id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div>
                                            <strong>Klaim #{claim.claim_id}</strong><br />
                                            <small className="text-muted">{new Date(claim.claim_date).toLocaleDateString('id-ID')}</small>
                                        </div>
                                        <span className="badge bg-info">{claim.status.replace(/_/g, ' ')}</span>
                                    </li>
                                )) : <li className="list-group-item px-0 text-muted">Belum ada riwayat klaim.</li>}
                            </ul>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <Card className="shadow-sm border-0 rounded-4 p-3">
                            <h6 className="mb-3 fw-semibold">Pengumuman</h6>
                            <Alert variant="info" className="rounded-3 mb-0">
                                📢 Selamat datang di sistem klaim kesehatan. Silakan lengkapi data keluarga Anda sebelum mengajukan klaim.
                            </Alert>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;