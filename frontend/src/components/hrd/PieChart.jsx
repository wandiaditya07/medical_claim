import axios from 'axios';
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

// Hapus data dummy: const dataStatusKlaim = [...]

const COLORS = ['#0d6efd', '#ffc107', '#dc3545', '#6c757d', '#28a745', '#17a2b8']; // Sesuaikan warna untuk lebih banyak status

const PieChart = ({ data }) => ( // Terima data sebagai prop
  <Card className="border-0 shadow-sm rounded-4 p-4">
    <h6 className="mb-4 fw-semibold">Status Klaim</h6>
    <ResponsiveContainer width="100%" height={280}>
      <RePieChart>
        <Pie
          data={data} // Gunakan data dari prop
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => ( // Loop berdasarkan data yang sebenarnya
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