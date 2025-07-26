import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarHRD from '../../components/hrd/Sidebar';
import { 
    Table, 
    Button, 
    Alert, 
    Row, 
    Col, 
    Form, 
    Dropdown, 
    InputGroup, 
    FormControl 
} from 'react-bootstrap';
import ActivationModal from '../../components/modals/hrd/ActivationModal';
import ChangePasswordModal from '../../components/modals/hrd/ChangePasswordModal';
import apiClient from '../../api/axiosConfig';

const AktivasiKaryawan = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // State untuk modal
    const [showActivationModal, setShowActivationModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    // --- State baru untuk filter dan pencarian ---
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPosition, setFilterPosition] = useState('');

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/employees');
            setEmployees(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        fetchEmployees();
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleError = (message) => {
        setError(message);
        setTimeout(() => setError(null), 5000);
    };

    const openActivationModal = (employee) => {
        setSelectedEmployee(employee);
        setShowActivationModal(true);
    };

    const openChangePasswordModal = (employee) => {
        setSelectedEmployee(employee);
        setShowChangePasswordModal(true);
    };

    // --- Logika baru untuk filter dan pencarian ---
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = searchQuery
            ? emp.employee_nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
              emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesPosition = filterPosition ? emp.position === filterPosition : true;
        return matchesSearch && matchesPosition;
    });

    const uniquePositions = [...new Set(employees.map(emp => emp.position).filter(Boolean))];

    return (
        <AppLayout sidebar={SidebarHRD}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-3">Manajemen Akun Karyawan</h4>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* --- UI baru untuk filter dan pencarian --- */}
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
                                <FormControl 
                                    placeholder="Cari NIK / Nama..." 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="table-responsive">
                    <Table bordered hover size="sm" className="align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>NIK</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Status Akun</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center">Memuat...</td></tr>
                            ) : filteredEmployees.length > 0 ? ( // <-- Gunakan filteredEmployees
                                filteredEmployees.map((k) => ( // <-- Gunakan filteredEmployees
                                    <tr key={k.employee_id}>
                                        <td>{k.employee_nik}</td>
                                        <td>{k.full_name}</td>
                                        <td>{k.email}</td>
                                        <td>
                                            <span className={`badge bg-${k.user_account_status ? 'success' : 'warning'}`}>
                                                {k.user_account_status ? 'Aktif' : 'Belum Aktif'}
                                            </span>
                                        </td>
                                        <td>
                                            {k.user_account_status ? (
                                                <Button 
                                                    variant="warning" 
                                                    size="sm"
                                                    onClick={() => openChangePasswordModal(k)}
                                                    className="text-white"
                                                >
                                                    Ubah Password
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="primary" 
                                                    size="sm"
                                                    onClick={() => openActivationModal(k)}
                                                >
                                                    Aktivasi Akun
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center">Tidak ada data karyawan yang cocok.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {selectedEmployee && (
                <>
                    <ActivationModal 
                        show={showActivationModal}
                        onHide={() => setShowActivationModal(false)}
                        employee={selectedEmployee}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                    <ChangePasswordModal
                        show={showChangePasswordModal}
                        onHide={() => setShowChangePasswordModal(false)}
                        employee={selectedEmployee}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </>
            )}
        </AppLayout>
    );
};

export default AktivasiKaryawan;