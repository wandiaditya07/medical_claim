// src/components/keuangan/PieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from 'react-bootstrap';

const COLORS = {
    'DISETUJUI_HRD': '#ffc107',
    'DIBAYARKAN_KEUANGAN': '#0d6efd',
};

const PieChartKeuangan = ({ data }) => {
    const chartData = data.map(d => ({...d, name: d.status.replace(/_/g, ' ')}));

    return (
        <Card className="p-3 shadow-sm h-100">
            <h6 className="mb-3">Status Klaim Saat Ini</h6>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#6c757d'} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} klaim`} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default PieChartKeuangan;