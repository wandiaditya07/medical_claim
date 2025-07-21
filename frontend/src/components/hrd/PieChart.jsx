import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from 'react-bootstrap';

const dataStatusKlaim = [
  { name: 'Disetujui', value: 60 },
  { name: 'Menunggu', value: 25 },
  { name: 'Ditolak', value: 15 },
];

const COLORS = ['#0d6efd', '#ffc107', '#dc3545'];

const PieChart = () => (
  <Card className="border-0 shadow-sm rounded-4 p-4">
    <h6 className="mb-4 fw-semibold">Status Klaim</h6>
    <ResponsiveContainer width="100%" height={280}>
      <RePieChart>
        <Pie
          data={dataStatusKlaim}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {dataStatusKlaim.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" iconType="circle" height={36} />
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  </Card>
);

export default PieChart;