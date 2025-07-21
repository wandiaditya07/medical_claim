import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Disetujui", value: 40 },
  { name: "Ditolak", value: 10 },
  { name: "Diproses", value: 20 },
];

const COLORS = ["#198754", "#dc3545", "#ffc107"];

const PieChartAdmin = () => {
  return (
    <div className="card shadow-sm p-3">
      <h6 className="mb-3 fw-bold">Distribusi Status Klaim</h6>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartAdmin;
