import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card } from "react-bootstrap";

const dataKlaimPerBulan = [
  { bulan: "Jan", jumlah: 2 },
  { bulan: "Feb", jumlah: 3 },
  { bulan: "Mar", jumlah: 4 },
  { bulan: "Apr", jumlah: 3 },
  { bulan: "Mei", jumlah: 5 },
  { bulan: "Jun", jumlah: 4 },
];

const BarChartKaryawan = () => {
  return (
    <Card className="shadow-sm border-0 rounded-4 p-3">
      <h6 className="mb-3 fw-bold text-primary">Riwayat Klaim per Bulan</h6>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dataKlaimPerBulan}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#0d6efd" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BarChartKaryawan;