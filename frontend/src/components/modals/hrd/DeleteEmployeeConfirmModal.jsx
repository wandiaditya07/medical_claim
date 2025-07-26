import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import apiClient from '../../../api/axiosConfig';

const DeleteEmployeeConfirmModal = ({ show, onHide, employee, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setFormError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await apiClient.delete(`/employees/${employee.employee_id}`, config);
      onSuccess('Karyawan dan data terkait berhasil dihapus.');
      onHide();
    } catch (err) {
      console.error("Error deleting employee:", err);
      setFormError(err.response?.data?.message || "Gagal menghapus karyawan.");
      onError(err.response?.data?.message || "Gagal menghapus karyawan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-trash3-fill me-2 text-danger"></i>Konfirmasi Hapus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formError && <Alert variant="danger">{formError}</Alert>}
        Apakah Anda yakin ingin menghapus data karyawan <strong>{employee?.full_name}</strong>?
        <p className="text-danger mt-2">Perhatian: Ini juga akan menghapus semua data tanggungan terkait!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="bi bi-x-circle me-1"></i>Batal
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Menghapus...' : <><i className="bi bi-trash-fill me-1"></i>Hapus</>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteEmployeeConfirmModal;