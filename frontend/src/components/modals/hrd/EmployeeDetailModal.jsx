import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Tabs, Tab, Alert } from 'react-bootstrap';
import AddEditDependentModal from './AddEditDependentModal';
import DeleteDependentConfirmModal from './DeleteDependentConfirmModal';
import apiClient from '../../../api/axiosConfig';
import { formatCurrency } from '../../../utils/formatCurrency';

const EmployeeDetailModal = ({ show, onHide, employee, onSuccess, onError }) => {
    const [detailLoading, setDetailLoading] = useState(true);
    const [detailError, setDetailError] = useState(null);
    const [detailedEmployee, setDetailedEmployee] = useState(null);
    const [dependentList, setDependentList] = useState([]);
    const [activeTab, setActiveTab] = useState('pribadi');

    const [showDependentModal, setShowDependentModal] = useState(false);
    const [selectedDependent, setSelectedDependent] = useState(null);
    const [showDeleteDependentModal, setShowDeleteDependentModal] = useState(false);
    const [dependentSuccessMessage, setDependentSuccessMessage] = useState(null);
    const [dependentError, setDependentError] = useState(null);

    const fetchEmployeeDetailsAndDependents = async () => {
        if (!employee || !employee.employee_id) return;

        setDetailLoading(true);
        setDetailError(null);
        try {
            const response = await apiClient.get(`/employees/${employee.employee_id}/details`);
            setDetailedEmployee(response.data.employee);
            setDependentList(response.data.dependents);
        } catch (err) {
            setDetailError("Gagal memuat detail karyawan.");
            if (onError) onError("Gagal memuat detail karyawan.");
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchEmployeeDetailsAndDependents();
            setActiveTab('pribadi');
        }
    }, [show, employee]);

    const handleAddDependent = () => {
        setSelectedDependent(null);
        setShowDependentModal(true);
    };

    const handleEditDependent = (dep) => {
        setSelectedDependent(dep);
        setShowDependentModal(true);
    };

    const handleShowDeleteDependent = (dep) => {
        setSelectedDependent(dep);
        setShowDeleteDependentModal(true);
    };

    const handleActionSuccess = (message) => {
        setDependentSuccessMessage(message);
        fetchEmployeeDetailsAndDependents();
        setTimeout(() => setDependentSuccessMessage(null), 3000);
    };

    const handleActionError = (message) => {
        setDependentError(message);
        setTimeout(() => setDependentError(null), 5000);
    };


    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-person-vcard-fill me-2"></i>Detail Karyawan: {detailedEmployee?.full_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {detailError && <Alert variant="danger">{detailError}</Alert>}
                {dependentSuccessMessage && <Alert variant="success">{dependentSuccessMessage}</Alert>}
                {dependentError && <Alert variant="danger">{dependentError}</Alert>}

                {detailLoading ? (
                    <div className="text-center p-4">Memuat detail...</div>
                ) : detailedEmployee && (
                    <Tabs
                        id="employee-detail-tabs"
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        {/* Tab 1: Informasi Pribadi */}
                        <Tab eventKey="pribadi" title="Informasi Pribadi">
                            <div className="p-3">
                                <p><strong>NIK:</strong> {detailedEmployee.employee_nik}</p>
                                <p><strong>Nama Lengkap:</strong> {detailedEmployee.full_name}</p>
                                <p><strong>Email:</strong> {detailedEmployee.email}</p>
                            </div>
                        </Tab>

                        {/* Tab 2: Informasi Pekerjaan */}
                        <Tab eventKey="pekerjaan" title="Informasi Pekerjaan">
                            <div className="p-3">
                                <p><strong>Jabatan:</strong> {detailedEmployee.position}</p>
                                <p><strong>Divisi:</strong> {detailedEmployee.department}</p>
                                <p><strong>Gaji Pokok:</strong> {formatCurrency(detailedEmployee.base_salary)}</p>
                                <p><strong>Tanggal Masuk:</strong> {detailedEmployee.created_at ? new Date(detailedEmployee.created_at).toLocaleDateString('id-ID') : '-'}</p>
                            </div>
                        </Tab>
                        
                        {/* Tab 3: Informasi Akun */}
                        <Tab eventKey="akun" title="Informasi Akun">
                            <div className="p-3">
                                <p><strong>Status Akun Sistem:</strong>
                                    {detailedEmployee.user_account_email ? (
                                        <span className={`badge bg-${detailedEmployee.user_account_status ? 'success' : 'warning'} ms-2`}>
                                            {detailedEmployee.user_account_status ? 'Aktif' : 'Belum Aktif'}
                                        </span>
                                    ) : (
                                        <span className="badge bg-secondary ms-2">Tidak Ada Akun</span>
                                    )}
                                </p>
                                {detailedEmployee.user_account_email && (
                                    <p><strong>Email Akun:</strong> {detailedEmployee.user_account_email}</p>
                                )}
                                {detailedEmployee.user_account_role && (
                                    <p><strong>Role Akun:</strong> {detailedEmployee.user_account_role}</p>
                                )}
                            </div>
                        </Tab>

                        {/* Tab 4: Data Tanggungan */}
                        <Tab eventKey="dependents" title="Data Tanggungan">
                            <div className="p-3">
                                <Button variant="primary" size="sm" className="mb-3" onClick={handleAddDependent}>
                                    <i className="bi bi-person-add me-2"></i>Tambah Tanggungan
                                </Button>
                                {dependentList.length === 0 ? (
                                    <p className="text-muted text-center">Tidak ada data tanggungan.</p>
                                ) : (
                                    <Table bordered hover size="sm" className="align-middle text-center">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Lengkap</th>
                                                <th>Hubungan</th>
                                                <th>Tgl Lahir</th>
                                                <th>Status</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dependentList.map((dep, idx) => (
                                                <tr key={dep.dependent_id}>
                                                    <td>{idx + 1}</td>
                                                    <td>{dep.full_name}</td>
                                                    <td>{dep.relationship}</td>
                                                    <td>{new Date(dep.birth_date).toLocaleDateString('id-ID')}</td>
                                                    <td>
                                                        <span className={`badge bg-${dep.is_active ? 'success' : 'secondary'}`}>
                                                            {dep.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Button variant="warning" size="sm" className="me-1 text-white" onClick={() => handleEditDependent(dep)}>
                                                            <i className="bi bi-pencil-square me-1"></i>Edit
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleShowDeleteDependent(dep)}>
                                                            <i className="bi bi-trash me-1"></i>Hapus
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                )}
            </Modal.Body>

            {/* Modals for Dependent CRUD (nested) */}
            <AddEditDependentModal
                show={showDependentModal}
                onHide={() => setShowDependentModal(false)}
                employeeId={detailedEmployee?.employee_id}
                dependent={selectedDependent}
                onSuccess={handleActionSuccess}
                onError={handleActionError}
            />
            <DeleteDependentConfirmModal
                show={showDeleteDependentModal}
                onHide={() => setShowDeleteDependentModal(false)}
                dependent={selectedDependent}
                onSuccess={handleActionSuccess}
                onError={handleActionError}
            />
        </Modal>
    );
};

export default EmployeeDetailModal;