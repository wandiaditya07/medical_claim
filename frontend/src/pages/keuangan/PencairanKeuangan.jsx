import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKeuangan from '../../components/keuangan/Sidebar';
import { Table, Button, Card, Modal, Alert, Badge, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const PencairanKeuangan = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // URL dasar backend Anda untuk membangun link file
    const BACKEND_URL = 'http://localhost:4000';

    const fetchClaimsForPayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/keuangan/claims-for-payment');
            setClaims(response.data);
        } catch (err) {
            setError('Gagal memuat data klaim.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaimsForPayment();
    }, []);

    const filteredClaims = claims.filter(claim =>
        claim.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (klaim) => {
        setSelectedClaim(klaim);
        setShowConfirmModal(true);
    };

    const handleCloseModal = () => {
        setSelectedClaim(null);
        setShowConfirmModal(false);
    };

    const handleConfirmPayment = async () => {
        if (!selectedClaim) return;
        
        try {
            await apiClient.put(`/claims/${selectedClaim.claim_id}/pay`, { 
                note: `Dibayarkan oleh tim Keuangan pada ${new Date().toLocaleDateString('id-ID')}` 
            });
            setSuccessMessage(`Klaim untuk ${selectedClaim.employee_name} berhasil ditandai sebagai lunas.`);
            handleCloseModal();
            fetchClaimsForPayment(); // Refresh data
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memproses pembayaran.');
        }
    };

    return (
        <AppLayout sidebar={SidebarKeuangan}>
            <div className="container-fluid py-4">
                <Row className="align-items-center mb-4">
                    <Col>
                        <h4 className="fw-bold mb-0">Pencairan Dana Klaim</h4>
                    </Col>
                    <Col md={5}>
                        <InputGroup>
                            <FormControl
                                placeholder="Cari nama karyawan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Card className="shadow-sm border-0 rounded-4 p-4">
                    <h5 className="fw-semibold mb-3">Daftar Klaim Menunggu Pembayaran</h5>
                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID Klaim</th>
                                    <th>Nama Karyawan</th>
                                    <th>Tanggal Klaim</th>
                                    <th>Jumlah</th>
                                    <th>Status</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center">Memuat...</td></tr>
                                ) : filteredClaims.length > 0 ? (
                                    filteredClaims.map((klaim) => (
                                        <tr key={klaim.claim_id}>
                                            <td>#{klaim.claim_id}</td>
                                            <td>{klaim.employee_name}</td>
                                            <td>{new Date(klaim.claim_date).toLocaleDateString('id-ID')}</td>
                                            <td>{formatCurrency(klaim.claim_amount)}</td>
                                            <td>
                                                <Badge bg="info" pill>{klaim.status.replace(/_/g, ' ')}</Badge>
                                            </td>
                                            <td className="text-center d-flex justify-content-center gap-2">
                                                {/* --- Tombol Lihat Bukti --- */}
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => window.open(`${BACKEND_URL}/${klaim.receipt_file}`, '_blank')}
                                                    disabled={!klaim.receipt_file}
                                                >
                                                    <i className="bi bi-eye me-1"></i> Lihat Bukti
                                                </Button>
                                                
                                                {/* Tombol Bayarkan */}
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(klaim)}
                                                >
                                                    <i className="bi bi-cash-coin me-1"></i> Bayarkan
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center text-muted">Data tidak ditemukan.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>

                <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Konfirmasi Pembayaran</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Apakah Anda yakin sudah melakukan transfer pembayaran untuk klaim atas nama{' '}
                        <strong>{selectedClaim?.employee_name}</strong> sejumlah{' '}
                        <strong>{formatCurrency(selectedClaim?.claim_amount || 0)}</strong>?
                        <p className="text-muted small mt-2">Tindakan ini akan mengubah status klaim menjadi "Dibayarkan" dan tidak dapat diurungkan.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Batal</Button>
                        <Button variant="success" onClick={handleConfirmPayment}>Ya, Sudah Dibayar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AppLayout>
    );
};

export default PencairanKeuangan;