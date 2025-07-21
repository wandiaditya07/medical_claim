import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKaryawan from '../../components/karyawan/Sidebar';
import SidebarHRD from '../../components/hrd/Sidebar';
import { Table, Button, Card, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Data dummy pengajuan
const dummyPengajuan = [
  {
    id: 1,
    nama: 'Sinta Lestari',
    tanggal: '2025-07-10',
    jumlah: 'Rp 1.000.000',
    status: 'Menunggu',
    rincian: {
      karyawan: 'Sinta Lestari',
      hubungan: 'Istri',
      diagnosa: 'Demam Berdarah',
      rumahSakit: 'RS Hermina Depok',
      tanggalBerobat: '2025-07-09',
      biaya: 'Rp 1.000.000',
      keterangan: 'Rawat inap 2 hari',
    }
  },
  {
    id: 2,
    nama: 'Doni Pratama',
    tanggal: '2025-07-11',
    jumlah: 'Rp 850.000',
    status: 'Menunggu',
    rincian: {
      karyawan: 'Doni Pratama',
      hubungan: 'Anak',
      diagnosa: 'Infeksi Saluran Pernapasan',
      rumahSakit: 'RS Mitra Keluarga',
      tanggalBerobat: '2025-07-10',
      biaya: 'Rp 850.000',
      keterangan: 'Rawat jalan & obat',
    }
  }
];

// Fungsi untuk badge status
const getBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'disetujui':
      return 'bg-success';
    case 'ditolak':
      return 'bg-danger';
    case 'menunggu':
    default:
      return 'bg-warning text-dark';
  }
};

const PersetujuanHRD = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleShowDetail = (klaim) => {
    setSelectedDetail(klaim);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedDetail(null);
  };

  const handleSetujui = (id) => {
    console.log(`Klaim ID ${id} disetujui`);
  };

  const handleTolak = (id) => {
    console.log(`Klaim ID ${id} ditolak`);
  };

  return (
    <AppLayout sidebar={SidebarHRD}>
      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4">Persetujuan Klaim Pengobatan</h4>
        <Card className="shadow-sm border-0 rounded-4 p-4">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Nama Karyawan</th>
                  <th>Tanggal Pengajuan</th>
                  <th>Jumlah Klaim</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dummyPengajuan.length > 0 ? (
                  dummyPengajuan.map((klaim, index) => (
                    <tr key={klaim.id}>
                      <td>{index + 1}</td>
                      <td>{klaim.nama}</td>
                      <td>{klaim.tanggal}</td>
                      <td>{klaim.jumlah}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(klaim.status)} px-3 py-2 rounded-pill`}>
                          {klaim.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleShowDetail(klaim)}>
                            <i className="bi bi-eye me-1"></i> Detail
                          </Button>
                          <Button variant="outline-success" size="sm" onClick={() => handleSetujui(klaim.id)}>
                            <i className="bi bi-check-circle me-1"></i> Setujui
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleTolak(klaim.id)}>
                            <i className="bi bi-x-circle me-1"></i> Tolak
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Tidak ada data pengajuan klaim.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Modal Detail */}
      <Modal show={showModal} onHide={handleClose} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Detail Klaim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetail && (
            <div className="lh-lg">
              <p><strong>Nama Karyawan:</strong> {selectedDetail.rincian.karyawan}</p>
              <p><strong>Hubungan:</strong> {selectedDetail.rincian.hubungan}</p>
              <p><strong>Diagnosa:</strong> {selectedDetail.rincian.diagnosa}</p>
              <p><strong>Rumah Sakit:</strong> {selectedDetail.rincian.rumahSakit}</p>
              <p><strong>Tanggal Berobat:</strong> {selectedDetail.rincian.tanggalBerobat}</p>
              <p><strong>Jumlah Biaya:</strong> {selectedDetail.rincian.biaya}</p>
              <p><strong>Keterangan Tambahan:</strong> {selectedDetail.rincian.keterangan}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </AppLayout>
  );
};

export default PersetujuanHRD;