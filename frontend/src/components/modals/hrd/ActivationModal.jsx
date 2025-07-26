// src/components/modals/hrd/ActivationModal.jsx
import apiClient from '../../../api/axiosConfig';
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ActivationModal = ({ show, onHide, employee, onSuccess, onError }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);
        try {
            const token = localStorage.getItem('jwtToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await apiClient.put(
                `/users/${employee.user_id}/activate`, 
                { new_password: password }, 
                config
            );
            
            onSuccess(`Akun untuk ${employee.full_name} berhasil diaktivasi.`);
            onHide();
            setPassword('');
        } catch (err) {
            const message = err.response?.data?.message || "Gagal mengaktivasi akun.";
            setFormError(message);
            onError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-key-fill me-2"></i>Aktivasi Akun Karyawan</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <p>Anda akan mengaktivasi akun untuk <strong>{employee?.full_name}</strong>.</p>
                    <Form.Group>
                        <Form.Label>Set Password Awal</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            placeholder="Masukkan password..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Batal</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Mengaktifkan...' : 'Simpan & Aktifkan'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ActivationModal;