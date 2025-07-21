import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", klaim: 12 },
  { name: "Feb", klaim: 18 },
  { name: "Mar", klaim: 22 },
  { name: "Apr", klaim: 15 },
  { name: "Mei", klaim: 30 },
  { name: "Jun", klaim: 25 },
];

const BarChartAdmin = () => {
  return (
    <div className="card shadow-sm p-3">
      <h6 className="mb-3 fw-bold">Jumlah Klaim Pengobatan per Bulan</h6>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="klaim" fill="#0d6efd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartAdmin;
