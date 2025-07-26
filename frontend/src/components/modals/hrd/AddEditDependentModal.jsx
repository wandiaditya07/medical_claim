import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import apiClient from '../../../api/axiosConfig';
const AddEditDependentModal = ({ show, onHide, employeeId, dependent, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    relationship: '',
    birth_date: '',
    is_active: false,
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (show && dependent) { // Edit mode
      setFormData({
        full_name: dependent.full_name,
        relationship: dependent.relationship,
        birth_date: dependent.birth_date ? dependent.birth_date.split('T')[0] : '', // Format date for input
        is_active: dependent.is_active,
      });
    } else if (show && !dependent) { // Add mode
      setFormData({ full_name: '', relationship: '', birth_date: '', is_active: false });
    }
  }, [show, dependent]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (dependent) { // Edit existing
        await apiClient.put(`/employees/dependents/${dependent.dependent_id}`, formData, config);
        onSuccess('Data tanggungan berhasil diperbarui.');
      } else { // Add new
        await apiClient.post(`/employees/${employeeId}/dependents`, formData, config);
        onSuccess('Tanggungan berhasil ditambahkan.');
      }
      onHide();
    } catch (err) {
      console.error("Error saving dependent:", err);
      setFormError(err.response?.data?.message || "Gagal menyimpan data tanggungan.");
      onError(err.response?.data?.message || "Gagal menyimpan data tanggungan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title><i className="bi bi-person-add me-2"></i>{dependent ? 'Edit' : 'Tambah'} Tanggungan</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form.Group className="mb-2">
            <Form.Label>Nama Lengkap</Form.Label>
            <Form.Control name="full_name" value={formData.full_name} onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Hubungan</Form.Label>
            <Form.Select name="relationship" value={formData.relationship} onChange={handleInputChange} required>
              <option value="">Pilih Hubungan</option>
              <option value="ISTRI">Istri</option>
              <option value="SUAMI">Suami</option>
              <option value="ANAK">Anak</option>
              <option value="AYAH">Ayah</option>
              <option value="IBU">Ibu</option>
              <option value="SAUDARA">Saudara</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tanggal Lahir</Form.Label>
            <Form.Control name="birth_date" type="date" value={formData.birth_date} onChange={handleInputChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <i className="bi bi-x-circle me-1"></i>Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : <><i className="bi bi-save me-1"></i>Simpan</>}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditDependentModal;