import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from 'react-bootstrap';

const dataStatusPembayaran = [
  { name: 'Sudah Dibayar', value: 420 },
  { name: 'Belum Dibayar', value: 116 },
];

const COLORS = ['#0d6efd', '#ffc107']; 

const PieChartKeuangan = () => {
  return (
    <Card className="p-4 shadow border-0 rounded-4">
      <h6 className="mb-3 fw-semibold text-primary">Status Pembayaran</h6>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataStatusPembayaran}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {dataStatusPembayaran.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} klaim`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PieChartKeuangan;