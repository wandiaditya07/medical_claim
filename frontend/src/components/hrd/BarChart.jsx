
import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from 'react-bootstrap';


const BarChart = ({ data }) => ( // Terima data sebagai prop
  <Card className="border-0 shadow-sm rounded-4 p-4">
    <h6 className="mb-4 fw-semibold">Grafik Klaim per Bulan</h6>
    <ResponsiveContainer width="100%" height={280}>
      <ReBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="jumlah" fill="#0d6efd" radius={[6, 6, 0, 0]} barSize={40} />
      </ReBarChart>
    </ResponsiveContainer>
  </Card>
);

export default BarChart;