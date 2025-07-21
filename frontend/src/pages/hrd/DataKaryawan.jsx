import React, { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarHRD from '../../components/hrd/Sidebar';
import {
  Table,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  Modal,
  Form,
  Dropdown,
} from 'react-bootstrap';

const dummyKaryawan = [
  { id: 1, nik: '101651016', nama: 'George Torison', jabatan: 'Technical Support', tglMasuk: '28-05-2025', divisi: 'Support' },
  { id: 2, nik: '17300005', nama: 'Reza Arap', jabatan: 'Technical Support', tglMasuk: '01-04-2025', divisi: 'Operasional' },
  { id: 3, nik: '17300009', nama: 'Yuka', jabatan: 'Manager', tglMasuk: '24-12-2024', divisi: 'Staff' },
  { id: 4, nik: '17300001', nama: 'Aloy', jabatan: 'Technical Support', tglMasuk: '11-06-2024', divisi: 'Staff' },
];

const DataKaryawan = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [formData, setFormData] = useState({ nik: '', nama: '', jabatan: '', divisi: '', tglMasuk: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data ditambahkan:", formData);
    setShowModal(false);
    setFormData({ nik: '', nama: '', jabatan: '', divisi: '', tglMasuk: '' });
  };

  const handleShowDetail = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setShowDetail(true);
  };

  const handleEdit = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setFormData(karyawan);
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Data diperbarui:", formData);
    setShowEditModal(false);
  };

  const handleShowDelete = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setShowDelete(true);
  };

  const handleDelete = () => {
    console.log("Dihapus:", selectedKaryawan);
    setShowDelete(false);
  };

  const role = localStorage.getItem('role');
  const getSidebar = () => {
    if (role === 'hrd') return SidebarHRD;
    if (role === 'karyawan') return SidebarKaryawan;
    if (role === 'keuangan') return SidebarKeuangan;
    return null;
  };

  const SidebarComponent = getSidebar();

  return (
    <AppLayout sidebar={SidebarComponent}>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Data Karyawan</h4>
          <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-person-plus-fill me-2"></i>Tambah Karyawan
          </Button>
        </div>

        <Row className="mb-3">
          <Col md={2}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" size="sm">
                Filter Jabatan
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Staff</Dropdown.Item>
                <Dropdown.Item>Manager</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={{ span: 3, offset: 7 }}>
            <InputGroup size="sm">
              <FormControl placeholder="Cari NIK / Nama" />
              <Button variant="dark">Cari</Button>
            </InputGroup>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table bordered hover size="sm" className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Tanggal Masuk</th>
                <th>Divisi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyKaryawan.map((k, i) => (
                <tr key={k.id}>
                  <td>{i + 1}</td>
                  <td>{k.nik}</td>
                  <td>{k.nama}</td>
                  <td>{k.jabatan}</td>
                  <td>{k.tglMasuk}</td>
                  <td>{k.divisi}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-1" onClick={() => handleShowDetail(k)}>
                      <i className="bi bi-search me-1"></i>Detail
                    </Button>
                    <Button variant="warning" size="sm" className="me-1 text-white" onClick={() => handleEdit(k)}>
                      <i className="bi bi-pencil-square me-1"></i>Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleShowDelete(k)}>
                      <i className="bi bi-trash me-1"></i>Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal Tambah Karyawan */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-person-plus-fill me-2"></i>Tambah Karyawan</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>NIK</Form.Label>
              <Form.Control name="nik" value={formData.nik} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nama</Form.Label>
              <Form.Control name="nama" value={formData.nama} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Jabatan</Form.Label>
              <Form.Control name="jabatan" value={formData.jabatan} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tgl Masuk</Form.Label>
              <Form.Control name="tglMasuk" type="date" value={formData.tglMasuk} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Divisi</Form.Label>
              <Form.Control name="divisi" value={formData.divisi} onChange={handleInputChange} required />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <i className="bi bi-x-circle me-1"></i>Batal
            </Button>
            <Button variant="primary" type="submit">
              <i className="bi bi-save me-1"></i>Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Edit Karyawan */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-pencil-fill me-2"></i>Edit Karyawan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>NIK</Form.Label>
              <Form.Control name="nik" value={formData.nik} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nama</Form.Label>
              <Form.Control name="nama" value={formData.nama} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Jabatan</Form.Label>
              <Form.Control name="jabatan" value={formData.jabatan} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tgl Masuk</Form.Label>
              <Form.Control name="tglMasuk" type="date" value={formData.tglMasuk} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Divisi</Form.Label>
              <Form.Control name="divisi" value={formData.divisi} onChange={handleInputChange} required />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              <i className="bi bi-x-circle me-1"></i>Batal
            </Button>
            <Button variant="success" type="submit">
              <i className="bi bi-check2-circle me-1"></i>Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Detail Karyawan */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-person-vcard-fill me-2"></i>Detail Karyawan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedKaryawan && (
            <div>
              <p><strong>NIK:</strong> {selectedKaryawan.nik}</p>
              <p><strong>Nama:</strong> {selectedKaryawan.nama}</p>
              <p><strong>Jabatan:</strong> {selectedKaryawan.jabatan}</p>
              <p><strong>Tanggal Masuk:</strong> {selectedKaryawan.tglMasuk}</p>
              <p><strong>Divisi:</strong> {selectedKaryawan.divisi}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-trash3-fill me-2 text-danger"></i>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus data karyawan <strong>{selectedKaryawan?.nama}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            <i className="bi bi-x-circle me-1"></i>Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash-fill me-1"></i>Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </AppLayout>
  );
};

export default DataKaryawan;