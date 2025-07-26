import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import apiClient from '../../../api/axiosConfig';

const DeleteDependentConfirmModal = ({ show, onHide, dependent, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setFormError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await apiClient.delete(`/employees/dependents/${dependent.dependent_id}`, config);
      onSuccess('Tanggungan berhasil dihapus.');
      onHide();
    } catch (err) {
      console.error("Error deleting dependent:", err);
      setFormError(err.response?.data?.message || "Gagal menghapus tanggungan.");
      onError(err.response?.data?.message || "Gagal menghapus tanggungan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-trash3-fill me-2 text-danger"></i>Konfirmasi Hapus Tanggungan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formError && <Alert variant="danger">{formError}</Alert>}
        Apakah Anda yakin ingin menghapus data tanggungan <strong>{dependent?.full_name}</strong>?
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

export default DeleteDependentConfirmModal;