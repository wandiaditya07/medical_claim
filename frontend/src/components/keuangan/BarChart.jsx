import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';

const dataPembayaranPerBulan = [
  { bulan: 'Jan', jumlah: 15 },
  { bulan: 'Feb', jumlah: 30 },
  { bulan: 'Mar', jumlah: 45 },
  { bulan: 'Apr', jumlah: 35 },
  { bulan: 'Mei', jumlah: 50 },
  { bulan: 'Jun', jumlah: 40 },
];

const BarChartKeuangan = () => {
  return (
    <Card className="p-3 shadow-sm">
      <h6 className="mb-3">Pembayaran per Bulan</h6>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dataPembayaranPerBulan}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#0d6efd" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BarChartKeuangan;