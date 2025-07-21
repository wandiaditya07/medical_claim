import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKaryawan from "../../components/karyawan/Sidebar";
import SidebarHRD from '../../components/hrd/Sidebar';
import { Table, Modal, Button, Form } from 'react-bootstrap';

const dummyRiwayatKlaim = [
  {
    id: 1,
    nama: 'Agus S.',
    tanggal: '2025-07-15',
    jenisKlaim: 'Rawat Jalan',
    jumlah: 300000,
    status: 'DIAJUKAN',
    keterangan: 'Demam dan batuk ringan.',
    bukti: 'surat_dokter_agus.pdf'
  },
  {
    id: 2,
    nama: 'Siti R.',
    tanggal: '2025-07-14',
    jenisKlaim: 'Obat Bebas',
    jumlah: 100000,
    status: 'DISETUJUI',
    keterangan: 'Pembelian obat flu di apotek.',
    bukti: 'bukti_pembelian_siti.pdf'
  }
];

const RiwayatKlaim = ({ role }) => {
  const [selectedKlaim, setSelectedKlaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const filteredKlaim = dummyRiwayatKlaim.filter(klaim =>
    filterStatus === '' ? true : klaim.status === filterStatus
  );

  const handleDetail = (klaim) => {
    setSelectedKlaim(klaim);
    setShowModal(true);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'DIAJUKAN':
        return 'warning';
      case 'DISETUJUI':
        return 'success';
      case 'DITOLAK':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const getSidebar = () => {
    switch (role) {
      case 'hrd':
        return SidebarHRD;
      case 'keuangan':
        return SidebarKeuangan;
      case 'karyawan':
        return SidebarKaryawan;
      default:
        return null;
    }
  };

  return (
    <AppLayout sidebar={SidebarHRD}>
      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4">Riwayat Klaim Pengobatan</h4>

        <Form.Select
          className="mb-3 w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value=''>Semua Status</option>
          <option value='DIAJUKAN'>Menunggu</option>
          <option value='DISETUJUI'>Disetujui</option>
          <option value='DITOLAK'>Ditolak</option>
        </Form.Select>

        <Table striped bordered hover responsive className="text-center">
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>Nama Karyawan</th>
              <th>Tanggal</th>
              <th>Jenis Klaim</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKlaim.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{item.tanggal}</td>
                <td>{item.jenisKlaim}</td>
                <td>{formatRupiah(item.jumlah)}</td>
                <td>
                  <span className={`badge bg-${getBadgeColor(item.status)}`}>{item.status}</span>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" onClick={() => handleDetail(item)}>
                    Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal Detail */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Detail Klaim</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedKlaim && (
              <>
                <p><strong>Nama:</strong> {selectedKlaim.nama}</p>
                <p><strong>Tanggal:</strong> {selectedKlaim.tanggal}</p>
                <p><strong>Jenis Klaim:</strong> {selectedKlaim.jenisKlaim}</p>
                <p><strong>Jumlah:</strong> {formatRupiah(selectedKlaim.jumlah)}</p>
                <p><strong>Status:</strong> {selectedKlaim.status}</p>
                <p><strong>Keterangan:</strong> {selectedKlaim.keterangan}</p>
                <p><strong>Bukti:</strong> <a href={`/${selectedKlaim.bukti}`} target="_blank" rel="noopener noreferrer">Lihat Bukti</a></p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default RiwayatKlaim;