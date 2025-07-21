import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "react-bootstrap";

const dataStatusKlaim = [
  { name: "Disetujui", value: 12 },
  { name: "Menunggu", value: 3 },
  { name: "Ditolak", value: 1 },
];

const COLORS = ['#0d6efd', '#ffc107', '#dc3545'];

const PieChartKaryawan = () => {
  return (
    <Card className="shadow-sm border-0 rounded-4 p-3">
      <h6 className="mb-3 fw-bold text-primary">Status Klaim Saya</h6>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataStatusKlaim}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {dataStatusKlaim.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PieChartKaryawan;