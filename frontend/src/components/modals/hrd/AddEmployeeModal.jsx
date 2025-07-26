import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import apiClient from '../../../api/axiosConfig';

const AddEmployeeModal = ({ show, onHide, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        employee_nik: '',
        full_name: '',
        position: '',
        department: '',
        base_salary: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [activeTab, setActiveTab] = useState('pribadi'); // State untuk mengontrol tab aktif

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);
        try {
            await apiClient.post(`/employees`, formData);
            onSuccess('Karyawan berhasil ditambahkan. Akun user dibuat (belum aktif).');
            onHide();
            // Reset form dan tab ke awal setelah berhasil
            setFormData({ employee_nik: '', full_name: '', position: '', department: '', base_salary: '', email: '' });
            setActiveTab('pribadi');
        } catch (err) {
            const message = err.response?.data?.message || "Gagal menambahkan karyawan.";
            setFormError(message);
            onError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <style>{`.disabled-tabs .nav-link {pointer-events: none;}`}</style>
            {/* Pindahkan Form untuk membungkus semua bagian Modal */}
            <Form onSubmit={handleSubmit}> 
                <Modal.Header closeButton>
                    <Modal.Title><i className="bi bi-person-plus-fill me-2"></i>Tambah Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    
                    <Tabs
                        id="add-employee-tabs"
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3 disabled-tabs"
                    >
                        <Tab eventKey="pribadi" title="Data Pribadi">
                            <Form.Group className="mb-2">
                                <Form.Label>NIK</Form.Label>
                                <Form.Control name="employee_nik" value={formData.employee_nik} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Nama Lengkap</Form.Label>
                                <Form.Control name="full_name" value={formData.full_name} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                            </Form.Group>
                        </Tab>
                        <Tab eventKey="pekerjaan" title="Informasi Pekerjaan">
                            <Form.Group className="mb-2">
                                <Form.Label>Jabatan</Form.Label>
                                <Form.Control name="position" value={formData.position} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Divisi</Form.Label>
                                <Form.Control name="department" value={formData.department} onChange={handleInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Gaji Pokok</Form.Label>
                                <Form.Control name="base_salary" type="number" value={formData.base_salary} onChange={handleInputChange} />
                            </Form.Group>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        <i className="bi bi-x-circle me-1"></i>Batal
                    </Button>

                    {/* Tombol navigasi antar tab */}
                    {activeTab === 'pekerjaan' && (
                        <Button variant="outline-secondary" onClick={() => setActiveTab('pribadi')}>
                            Sebelumnya
                        </Button>
                    )}
                    
                    {activeTab === 'pribadi' ? (
                        <Button variant="primary" onClick={() => setActiveTab('pekerjaan')}>
                            Selanjutnya <i className="bi bi-arrow-right"></i>
                        </Button>
                    ) : (
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : <><i className="bi bi-save me-1"></i>Simpan</>}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;