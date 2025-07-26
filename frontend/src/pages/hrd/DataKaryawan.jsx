import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarHRD from '../../components/hrd/Sidebar';
import axios from 'axios';
import apiClient from '../../api/axiosConfig';
import {
  Table,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  Dropdown,
  Alert,
  Form // Tambahkan Form untuk Form.Label
} from 'react-bootstrap';

// Import komponen modal yang baru
import AddEmployeeModal from '../../components/modals/hrd/AddEmployeeModal';
import EditEmployeeModal from '../../components/modals/hrd/EditEmployeeModal';
import DeleteEmployeeConfirmModal from '../../components/modals/hrd/DeleteEmployeeConfirmModal';
import EmployeeDetailModal from '../../components/modals/hrd/EmployeeDetailModal';


const DataKaryawan = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null); // Karyawan yang dipilih

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState(''); // Mengganti filterJabatan ke filterPosition

  // --- Fetch Employees ---
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.get('/employees', config);
      console.log("Data fetched for DataKaryawan:", response.data);
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.response?.data?.message || "Gagal memuat data karyawan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- Callbacks for Modals (to refetch data) ---
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setError(null);
    fetchEmployees(); // Selalu refresh data setelah sukses
    setTimeout(() => setSuccessMessage(null), 3000); // Hilangkan pesan sukses setelah 3 detik
  };

  const handleError = (message) => {
    setError(message);
    setSuccessMessage(null);
    setTimeout(() => setError(null), 5000); // Hilangkan pesan error setelah 5 detik
  };

  // --- Handle Modal Open/Close ---
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const openDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };
  const closeDetailModal = () => setShowDetailModal(false);


  // --- Filtering & Searching ---
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchQuery
      ? emp.employee_nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesPosition = filterPosition ? emp.position === filterPosition : true;
    return matchesSearch && matchesPosition;
  });

  // Unique positions for filter dropdown
  const uniquePositions = [...new Set(employees.map(emp => emp.position))];


  return (
    <AppLayout sidebar={SidebarHRD}>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Data Karyawan</h4>
          <Button variant="dark" size="sm" onClick={openAddModal}>
            <i className="bi bi-person-plus-fill me-2"></i>Tambah Karyawan
          </Button>
        </div>

        {successMessage && <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="mb-3">{successMessage}</Alert>}
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-3">Error: {error}</Alert>}

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
                <Form.Label className="small mb-1">Filter Jabatan</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-dark" size="sm" className="w-100">
                        {filterPosition || "Pilih Jabatan"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilterPosition('')}>Semua Jabatan</Dropdown.Item>
                        {uniquePositions.map((pos, idx) => (
                            <Dropdown.Item key={idx} onClick={() => setFilterPosition(pos)}>{pos}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Form.Group>
          </Col>
          <Col md={{ span: 4, offset: 5 }}>
            <Form.Group>
                <Form.Label className="small mb-1">Cari Karyawan</Form.Label>
                <InputGroup size="sm">
                    <FormControl placeholder="Cari NIK / Nama..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Button variant="dark">Cari</Button>
                </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table bordered hover size="sm" className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Jabatan</th>
                <th>Divisi</th>
                <th>Status Akun</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center">Memuat data karyawan...</td></tr>
              ) : filteredEmployees.length === 0 ? (
                <tr><td colSpan="8" className="text-center">Tidak ada data karyawan.</td></tr>
              ) : (
                filteredEmployees.map((k, i) => (
                  <tr key={k.employee_id}>
                    <td>{i + 1}</td>
                    <td>{k.employee_nik}</td>
                    <td>{k.full_name}</td>
                    <td>{k.email}</td>
                    <td>{k.position}</td>
                    <td>{k.department}</td>
                    <td>
                      {k.user_id && k.user_account_email ? (
                        <span className={`badge bg-${k.user_account_status ? 'success' : 'warning'}`}>
                          {k.user_account_status ? 'Aktif' : 'Belum Aktif'}
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Tidak Ada Akun</span>
                      )}
                    </td>
                    <td>
                      <Button variant="info" size="sm" className="me-1" onClick={() => openDetailModal(k)}>
                        <i className="bi bi-search me-1"></i>Detail
                      </Button>
                      <Button variant="warning" size="sm" className="me-1 text-white" onClick={() => openEditModal(k)}>
                        <i className="bi bi-pencil-square me-1"></i>Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => openDeleteModal(k)}>
                        <i className="bi bi-trash me-1"></i>Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Render Modal Components */}
      <AddEmployeeModal show={showAddModal} onHide={closeAddModal} onSuccess={handleSuccess} onError={handleError} />
      <EditEmployeeModal show={showEditModal} onHide={closeEditModal} employee={selectedEmployee} onSuccess={handleSuccess} onError={handleError} />
      <DeleteEmployeeConfirmModal show={showDeleteModal} onHide={closeDeleteModal} employee={selectedEmployee} onSuccess={handleSuccess} onError={handleError} />
      <EmployeeDetailModal show={showDetailModal} onHide={closeDetailModal} employee={selectedEmployee} onSuccess={handleSuccess} onError={handleError} />
    </AppLayout>
  );
};

export default DataKaryawan;