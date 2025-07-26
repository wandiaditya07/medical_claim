// src/components/keuangan/BarChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';
import { formatCurrency } from '../../utils/formatCurrency';

const BarChartKeuangan = ({ data }) => {
    // Memastikan 12 bulan ditampilkan
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const chartData = months.map(monthName => {
        const found = data.find(d => d.bulan === monthName);
        return {
            bulan: monthName,
            jumlah: found ? found.jumlah : 0
        };
    });

    return (
        <Card className="p-3 shadow-sm h-100">
            <h6 className="mb-3">Total Pembayaran per Bulan</h6>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="jumlah" fill="#0d6efd" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default BarChartKeuangan;