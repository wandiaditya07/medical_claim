import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKeuangan from '../../components/keuangan/Sidebar';
import SidebarHRD from "../../components/hrd/Sidebar";
import { Table, Card, Button, Modal, Badge } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const dummyKlaim = [
  { id: 1, nama: 'Andi Saputra', tanggal: '2025-07-01', status: 'Disetujui', jumlah: 1500000, sudahDicairkan: false },
  { id: 2, nama: 'Rina Kurnia', tanggal: '2025-07-03', status: 'Disetujui', jumlah: 750000, sudahDicairkan: true },
  { id: 3, nama: 'Bagus Adi', tanggal: '2025-07-06', status: 'Disetujui', jumlah: 2000000, sudahDicairkan: false },
];

const formatRupiah = (angka) => {
  return 'Rp ' + angka.toLocaleString('id-ID');
};

const PencairanKeuangan = () => {
  const [klaimList, setKlaimList] = useState(dummyKlaim);
  const [showModal, setShowModal] = useState(false);
  const [selectedKlaim, setSelectedKlaim] = useState(null);

  const handleOpenModal = (klaim) => {
    setSelectedKlaim(klaim);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedKlaim(null);
    setShowModal(false);
  };

  const handleKonfirmasi = () => {
    if (!selectedKlaim) return;
    const updated = klaimList.map((item) =>
      item.id === selectedKlaim.id
        ? { ...item, sudahDicairkan: true, status: 'Sudah Dicairkan' }
        : item
    );
    setKlaimList(updated);
    handleCloseModal();
  };

  return (
    <AppLayout sidebar={SidebarHRD}>
      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4">💸 Pencairan Dana Klaim</h4>

        <Card className="shadow-sm border-0 rounded-4 p-4 mb-5">
          <h5 className="fw-semibold mb-3">Daftar Klaim Disetujui</h5>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {klaimList.map((klaim, index) => (
                  <tr key={klaim.id}>
                    <td>{index + 1}</td>
                    <td>{klaim.nama}</td>
                    <td>{klaim.tanggal}</td>
                    <td>{formatRupiah(klaim.jumlah)}</td>
                    <td>
                      <Badge
                        bg={klaim.sudahDicairkan ? 'success' : 'warning'}
                        text={klaim.sudahDicairkan ? 'light' : 'dark'}
                        className="px-3 py-2 rounded-pill"
                      >
                        {klaim.sudahDicairkan ? 'Sudah Dicairkan' : 'Menunggu Pencairan'}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {!klaim.sudahDicairkan && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleOpenModal(klaim)}
                        >
                          <i className="bi bi-cash-coin me-1"></i> Cairkan
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        <h5 className="fw-bold mb-3">📋 Rekap Dana Sudah Dicairkan</h5>
        <Card className="shadow-sm border-0 rounded-4 p-4">
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {klaimList.filter(k => k.sudahDicairkan).map((klaim, index) => (
                  <tr key={klaim.id}>
                    <td>{index + 1}</td>
                    <td>{klaim.nama}</td>
                    <td>{klaim.tanggal}</td>
                    <td>{formatRupiah(klaim.jumlah)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Pencairan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Apakah Anda yakin ingin mencairkan klaim atas nama{' '}
            <strong>{selectedKlaim?.nama}</strong> sejumlah{' '}
            <strong>{formatRupiah(selectedKlaim?.jumlah || 0)}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="success" onClick={handleKonfirmasi}>
              Ya, Cairkan
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default PencairanKeuangan;