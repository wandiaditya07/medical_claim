// src/components/modals/hrd/ChangePasswordModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import apiClient from '../../../api/axiosConfig';
const ChangePasswordModal = ({ show, onHide, employee, onSuccess, onError }) => {
    const [formData, setFormData] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        if (formData.new_password !== formData.confirm_password) {
            setFormError('Password baru dan konfirmasi tidak cocok.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await apiClient.put(
                `/users/${employee.user_id}/change-password`, 
                formData, 
                config
            );
            
            onSuccess(`Password untuk ${employee.full_name} berhasil diubah.`);
            onHide();
            setFormData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            const message = err.response?.data?.message || "Gagal mengubah password.";
            setFormError(message);
            onError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title><i className="bi bi-shield-lock-fill me-2"></i>Ubah Password</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <p>Anda akan mengubah password untuk <strong>{employee?.full_name}</strong>.</p>
                    <Form.Group className="mb-3">
                        <Form.Label>Password Lama</Form.Label>
                        <Form.Control type="password" name="old_password" value={formData.old_password} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password Baru</Form.Label>
                        <Form.Control type="password" name="new_password" value={formData.new_password} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Verifikasi Password Baru</Form.Label>
                        <Form.Control type="password" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Batal</Button>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;