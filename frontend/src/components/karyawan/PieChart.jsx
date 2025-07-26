// src/components/karyawan/PieChart.jsx
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import apiClient from '../../api/axiosConfig';

const COLORS = {
    'DISETUJUI HRD': '#28a745',
    'PENGAJUAN': '#ffc107',
    'DITOLAK HRD': '#dc3545',
    'DIBAYARKAN KEUANGAN': '#0d6efd',
};

const PieChartKaryawan = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/karyawan/claims-status')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching pie chart data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Memuat grafik...</p>;

    return (
        <>
            <h6 className="mb-3 fw-bold text-primary">Status Klaim Saya</h6>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toUpperCase()] || '#6c757d'} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default PieChartKaryawan;