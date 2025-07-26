// src/pages/hrd/PersetujuanHRD.jsx

import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarHRD from '../../components/hrd/Sidebar';
import { Table, Button, Card, Modal, Alert, Badge } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import apiClient from '../../api/axiosConfig';
import ApprovalActionModal from '../../components/modals/hrd/ApprovalActionModal';

const PersetujuanHRD = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [currentAction, setCurrentAction] = useState(null); // 'approve' or 'reject'

    const fetchClaimsForApproval = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/claims/for-approval');
            setClaims(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data pengajuan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaimsForApproval();
    }, []);
    
    const handleShowDetail = (claim) => {
        setSelectedClaim(claim);
        setShowDetailModal(true);
    };

    const handleShowAction = (claim, action) => {
        setSelectedClaim(claim);
        setCurrentAction(action);
        setShowActionModal(true);
    };

    const handleCloseModals = () => {
        setShowDetailModal(false);
        setShowActionModal(false);
        setSelectedClaim(null);
        setCurrentAction(null);
    };

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        fetchClaimsForApproval(); // Refresh data
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    return (
        <AppLayout sidebar={SidebarHRD}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-4">Persetujuan Klaim Pengobatan</h4>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Card className="shadow-sm border-0 rounded-4 p-4">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Nama Karyawan</th>
                                    <th>Tanggal Pengajuan</th>
                                    <th>Jumlah Klaim</th>
                                    <th>Status</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center">Memuat...</td></tr>
                                ) : claims.length > 0 ? (
                                    claims.map((claim, index) => (
                                        <tr key={claim.claim_id}>
                                            <td>{index + 1}</td>
                                            <td>{claim.employee_name}</td>
                                            <td>{new Date(claim.claim_date).toLocaleDateString('id-ID')}</td>
                                            <td>Rp {claim.claim_amount.toLocaleString('id-ID')}</td>
                                            <td><Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">{claim.status.replace('_', ' ')}</Badge></td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleShowDetail(claim)}>
                                                        <i className="bi bi-eye me-1"></i> Detail
                                                    </Button>
                                                    <Button variant="outline-success" size="sm" onClick={() => handleShowAction(claim, 'approve')}>
                                                        <i className="bi bi-check-circle me-1"></i> Setujui
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleShowAction(claim, 'reject')}>
                                                        <i className="bi bi-x-circle me-1"></i> Tolak
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center text-muted py-4">Tidak ada data pengajuan klaim baru.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* Modal Detail */}
            <Modal show={showDetailModal} onHide={handleCloseModals} centered size="md">
                <Modal.Header closeButton><Modal.Title>Detail Klaim</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedClaim && (
                        <div className="lh-lg">
                            <p><strong>Nama Karyawan:</strong> {selectedClaim.employee_name}</p>
                            {selectedClaim.dependent_name && <p><strong>Pasien:</strong> {selectedClaim.dependent_name} ({selectedClaim.dependent_relationship})</p>}
                            <p><strong>Tanggal Klaim:</strong> {new Date(selectedClaim.claim_date).toLocaleDateString('id-ID')}</p>
                            <p><strong>Jumlah Biaya:</strong> Rp {selectedClaim.claim_amount.toLocaleString('id-ID')}</p>
                            <p><strong>Keterangan:</strong> {selectedClaim.claim_description || '-'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={handleCloseModals}>Tutup</Button></Modal.Footer>
            </Modal>
            
            {/* Modal Aksi (Setuju/Tolak) */}
            {selectedClaim && (
                <ApprovalActionModal 
                    show={showActionModal}
                    onHide={handleCloseModals}
                    claim={selectedClaim}
                    action={currentAction}
                    onSuccess={handleSuccess}
                />
            )}
        </AppLayout>
    );
};

export default PersetujuanHRD;