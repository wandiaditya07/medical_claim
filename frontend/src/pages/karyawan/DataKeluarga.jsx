import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKaryawan from '../../components/karyawan/Sidebar';
import { Table, Button, Alert, Card, Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
// import AddEditDependentModal from '../../components/modals/hrd/AddEditDependentModal';
// import DeleteDependentConfirmModal from '../../components/modals/hrd/DeleteDependentConfirmModal';

const DataKeluarga = () => {
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [successMessage, setSuccessMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // const [showAddEditModal, setShowAddEditModal] = useState(false);
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [selectedDependent, setSelectedDependent] = useState(null);

    const fetchDependents = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/dependents');
            setDependents(response.data);
        } catch (err) {
            setError('Gagal memuat data keluarga.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDependents();
    }, []);

    const filteredDependents = dependents.filter(dep => 
        dep.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dep.relationship.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const handleSuccess = (message) => {
    //     setSuccessMessage(message);
    //     fetchDependents();
    //     setTimeout(() => setSuccessMessage(null), 3000);
    // };

    // const handleError = (message) => {
    //     setError(message);
    //     setTimeout(() => setError(null), 5000);
    // };

    // const openAddModal = () => {
    //     setSelectedDependent(null);
    //     setShowAddEditModal(true);
    // };

    // const openEditModal = (dependent) => {
    //     setSelectedDependent(dependent);
    //     setShowAddEditModal(true);
    // };

    // const openDeleteModal = (dependent) => {
    //     setSelectedDependent(dependent);
    //     setShowDeleteModal(true);
    // };

    return (
        <AppLayout sidebar={SidebarKaryawan}>
            <div className="container-fluid py-4">
                <Row className="mb-3 align-items-center">
                    <Col md={5}>
                        <h4 className="fw-bold mb-0">Data Keluarga</h4>
                    </Col>
                    <Col md={{ span: 4, offset: 8 }}>
                        <InputGroup>
                            <FormControl
                                placeholder="Cari nama atau hubungan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3} className="text-end">
                        {/* <Button variant="primary" size="sm" onClick={openAddModal}>
                            <i className="bi bi-plus-circle me-2"></i>Tambah Anggota
                        </Button> */}
                    </Col>
                </Row>

                {/* {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>} */}

                <Card className="shadow-sm border-0 rounded-4">
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Lengkap</th>
                                        <th>Hubungan</th>
                                        <th>Tanggal Lahir</th>
                                        <th>Status</th>
                                        {/* <th>Aksi</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">Memuat...</td></tr>
                                    ) : filteredDependents.length > 0 ? (
                                        filteredDependents.map((dep, idx) => (
                                            <tr key={dep.dependent_id}>
                                                <td>{idx + 1}</td>
                                                <td>{dep.full_name}</td>
                                                <td>{dep.relationship}</td>
                                                <td>{new Date(dep.birth_date).toLocaleDateString('id-ID')}</td>
                                                <td>
                                                    <span className={`badge bg-${dep.is_active ? 'success' : 'warning text-dark'}`}>
                                                        {dep.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                    </span>
                                                </td>
                                                {/* <td>
                                                    <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => openEditModal(dep)}>Edit</Button>
                                                    <Button variant="danger" size="sm" onClick={() => openDeleteModal(dep)}>Hapus</Button>
                                                </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center text-muted">Data tidak ditemukan.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* <AddEditDependentModal
                show={showAddEditModal}
                onHide={() => setShowAddEditModal(false)}
                dependent={selectedDependent}
                onSuccess={handleSuccess}
                onError={handleError}
            />
            <DeleteDependentConfirmModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                dependent={selectedDependent}
                onSuccess={handleSuccess}
                onError={handleError}
            /> */}
        </AppLayout>
    );
};

export default DataKeluarga;