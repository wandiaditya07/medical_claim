import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import apiClient from '../../../api/axiosConfig';

const EditEmployeeModal = ({ show, onHide, employee, onSuccess, onError }) => {
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
    const [activeTab, setActiveTab] = useState('pribadi');

    useEffect(() => {
        if (show && employee) {
            setFormData({
                employee_id: employee.employee_id,
                employee_nik: employee.employee_nik || '',
                full_name: employee.full_name || '',
                position: employee.position || '',
                department: employee.department || '',
                base_salary: employee.base_salary || '',
                email: employee.email || '',
            });
            setActiveTab('pribadi');
        }
    }, [show, employee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        // e.preventDefault() tidak lagi dibutuhkan karena ini bukan event submit form
        setLoading(true);
        setFormError(null);
        try {
            await apiClient.put(`/employees/${formData.employee_id}`, formData);
            onSuccess('Data karyawan berhasil diperbarui.');
            onHide();
        } catch (err) {
            const message = err.response?.data?.message || "Gagal memperbarui data karyawan.";
            setFormError(message);
            onError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <style>{`.disabled-tabs .nav-link {pointer-events: none;}`}</style>
            {/* PERUBAHAN 1: Hapus prop 'onSubmit' dari Form */}
            <Form>
                <Modal.Header closeButton>
                    <Modal.Title><i className="bi bi-pencil-fill me-2"></i>Edit Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    
                    <Tabs
                        id="edit-employee-tabs"
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
                        // PERUBAHAN 2 & 3: Hapus 'type="submit"' dan tambahkan 'onClick={handleSubmit}'
                        <Button variant="success" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Memperbarui...' : <><i className="bi bi-check2-circle me-1"></i>Update</>}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditEmployeeModal;