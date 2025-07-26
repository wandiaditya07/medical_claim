// src/components/modals/hrd/ApprovalActionModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import apiClient from '../../../api/axiosConfig';

const ApprovalActionModal = ({ show, onHide, claim, action, onSuccess }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isReject = action === 'reject';
    const title = isReject ? 'Tolak Klaim' : 'Setujui Klaim';
    const variant = isReject ? 'danger' : 'success';

    const handleSubmit = async () => {
        if (isReject && !note) {
            setError('Alasan penolakan wajib diisi.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await apiClient.put(`/claims/${claim.claim_id}/${action}`, { note });
            onSuccess(`Klaim untuk ${claim.employee_name} berhasil di${isReject ? 'tolak' : 'setujui'}.`);
            onHide();
            setNote('');
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <p>
                    Apakah Anda yakin ingin <strong>{action}</strong> klaim dari <strong>{claim?.employee_name}</strong> sebesar 
                    <strong> Rp {claim?.claim_amount.toLocaleString('id-ID')}</strong>?
                </p>
                {isReject && (
                    <Form.Group>
                        <Form.Label>Alasan Penolakan (Wajib)</Form.Label>
                        <Form.Control as="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                    </Form.Group>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Batal</Button>
                <Button variant={variant} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Memproses...' : `Ya, ${title}`}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ApprovalActionModal;