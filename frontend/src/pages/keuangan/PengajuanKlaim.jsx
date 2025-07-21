import React from 'react';
import AppLayout from '../../layouts/AppLayout'; 
import { Card, Form, Button } from 'react-bootstrap';

import SidebarHRD from "../../components/hrd/Sidebar";
import SidebarKeuangan from '../../components/keuangan/Sidebar';
import SidebarKaryawan from '../../components/karyawan/Sidebar';

const PengajuanKlaim = () => {
  const role = localStorage.getItem('role');

  const getSidebar = () => {
    switch (role) {
      case 'hrd':
        return SidebarHRD;
      case 'keuangan':
        return SidebarKeuangan;
      case 'karyawan':
        return SidebarKaryawan;
      default:
        return () => <div>Unauthorized</div>;
    }
  };

  return (
    <AppLayout sidebar={getSidebar()}>
      <div className="container-fluid">
        <h4 className="fw-bold mb-4">Form Pengajuan Klaim</h4>

        <Card className="p-4 shadow-sm">
          <Form>
            <Form.Group className="mb-3" controlId="namaKaryawan">
              <Form.Label>Nama Karyawan</Form.Label>
              <Form.Control type="text" placeholder="Masukkan nama karyawan" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tanggal">
              <Form.Label>Tanggal Pengajuan</Form.Label>
              <Form.Control type="date" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="jenisKlaim">
              <Form.Label>Jenis Klaim</Form.Label>
              <Form.Select>
                <option>Rawat Jalan</option>
                <option>Rawat Inap</option>
                <option>Melahirkan</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="jumlahBiaya">
              <Form.Label>Jumlah Biaya</Form.Label>
              <Form.Control type="number" placeholder="Rp" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lampiran">
              <Form.Label>Lampiran Bukti</Form.Label>
              <Form.Control type="file" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Ajukan Klaim
            </Button>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PengajuanKlaim;