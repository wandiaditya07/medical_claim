// src/components/karyawan/BarChart.jsx
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import apiClient from '../../api/axiosConfig';

const BarChartKaryawan = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/karyawan/claims-per-month')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching bar chart data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Memuat grafik...</p>;

    return (
        <>
            <h6 className="mb-3 fw-bold text-primary">Riwayat Klaim per Bulan</h6>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jumlah" fill="#0d6efd" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default BarChartKaryawan;