// src/pages/keuangan/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKeuangan from '../../components/keuangan/Sidebar';
import SummaryCard from '../../components/keuangan/SummaryCard';
import BarChartKeuangan from '../../components/keuangan/BarChart';
import PieChartKeuangan from '../../components/keuangan/PieChart';
import { Alert, Table, Badge } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const getStatusColor = (status) => {
    switch (status) {
        case "PENGAJUAN": return "warning";
        case "DISETUJUI_HRD": return "primary";
        case "DIBAYARKAN_KEUANGAN": return "success";
        case "DITOLAK_HRD": return "danger";
        default: return "secondary";
    }
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiClient.get('/keuangan/dashboard-summary')
            .then(res => setData(res.data))
            .catch(() => setError("Gagal memuat data dashboard."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <AppLayout sidebar={SidebarKeuangan}><p className="p-4">Memuat...</p></AppLayout>;
    if (error) return <AppLayout sidebar={SidebarKeuangan}><Alert variant="danger" className="m-4">{error}</Alert></AppLayout>;

    const summaryCardsData = [
        { title: "Klaim Belum Cair", value: data.summaryData.pendingPayments, note: "Perlu segera diproses", color: "warning" },
        { title: "Total Dibayar Bulan Ini", value: formatCurrency(data.summaryData.totalPaidThisMonth), note: `Per ${new Date().toLocaleDateString('id-ID', { month: 'long' })}`, color: "success" },
        { title: "Total Dibayar (Semua)", value: formatCurrency(data.summaryData.totalPaidAllTime), note: "Sejak awal", color: "secondary" }
    ];

    return (
        <AppLayout sidebar={SidebarKeuangan}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-4">Dashboard Keuangan</h4>
                <div className="row g-4 mb-4">
                    {summaryCardsData.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <SummaryCard {...item} />
                        </div>
                    ))}
                </div>
                <div className="row g-4 mb-4">
                    <div className="col-lg-8"><BarChartKeuangan data={data.barChartData} /></div>
                    <div className="col-lg-4"><PieChartKeuangan data={data.pieChartData} /></div>
                </div>
                <div className="card shadow-sm border-0 rounded-4">
                    <div className="card-header fw-semibold">5 Klaim Terbaru</div>
                    <div className="card-body p-0">
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nama Karyawan</th>
                                    <th>Nominal</th>
                                    <th>Status</th>
                                    <th>Tanggal Pengajuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.latestClaims.map((claim, index) => (
                                    <tr key={index}>
                                        <td>{claim.nama}</td>
                                        <td>{formatCurrency(claim.nominal)}</td>
                                        <td>
                                            <Badge bg={getStatusColor(claim.status)}>
                                                {claim.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td>{new Date(claim.tanggal).toLocaleDateString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;