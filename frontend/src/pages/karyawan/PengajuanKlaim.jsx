import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKaryawan from '../../components/karyawan/Sidebar';
import { Form, Button, Card, Col, Row, Alert, Tabs, Tab } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const PengajuanKlaim = () => {
    const [formData, setFormData] = useState({
        dependent_id: '',
        claim_date: '',
        claim_amount: '',
        claim_description: '',
        receipt_file: null,
    });
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // State untuk tab
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/dependents')
            .then(response => {
                setDependents(response.data);
            })
            .catch(() => {
                setError('Gagal memuat data tanggungan.');
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, receipt_file: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }

        try {
            await apiClient.post('/claims', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccessMessage('Klaim berhasil diajukan! Anda akan dialihkan ke halaman riwayat.');
            setTimeout(() => {
                navigate('/karyawan/riwayat-klaim');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengajukan klaim.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout sidebar={SidebarKaryawan}>
          <style>{`.disabled-tabs .nav-link {pointer-events: none;}`}</style>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-3">Formulir Pengajuan Klaim</h4>
                <Card className="shadow-sm border-0 rounded-4">
                    <Form onSubmit={handleSubmit}>
                        <Card.Body>
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Tabs
                                id="pengajuan-klaim-tabs"
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-3 disabled-tabs"
                            >
                                <Tab eventKey="info" title="Informasi Klaim">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Pasien</Form.Label>
                                                <Form.Select name="dependent_id" value={formData.dependent_id} onChange={handleInputChange}>
                                                    <option value="">Diri Sendiri</option>
                                                    {dependents.map(dep => (
                                                        <option key={dep.dependent_id} value={dep.dependent_id}>
                                                            {dep.full_name} ({dep.relationship})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tanggal Kuitansi</Form.Label>
                                                <Form.Control type="date" name="claim_date" value={formData.claim_date} onChange={handleInputChange} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Jumlah Biaya</Form.Label>
                                        <Form.Control type="number" name="claim_amount" placeholder="Contoh: 150000" value={formData.claim_amount} onChange={handleInputChange} required />
                                    </Form.Group>
                                </Tab>
                                <Tab eventKey="dokumen" title="Deskripsi & Dokumen">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Keterangan</Form.Label>
                                        <Form.Control as="textarea" rows={3} name="claim_description" placeholder="Contoh: Berobat demam di RS Hermina" value={formData.claim_description} onChange={handleInputChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Bukti Bayar (File jangan lebih dari 2MB)</Form.Label>
                                        <Form.Control type="file" name="receipt_file" onChange={handleFileChange} />
                                    </Form.Group>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                        <Card.Footer className="text-end">
                            {activeTab === 'dokumen' && (
                                <Button variant="outline-secondary" className="me-2" onClick={() => setActiveTab('info')} type="button">
                                    Sebelumnya
                                </Button>
                            )}
                            {activeTab === 'info' ? (
                                <Button variant="primary" onClick={() => setActiveTab('dokumen')} type="button">
                                    Selanjutnya <i className="bi bi-arrow-right"></i>
                                </Button>
                            ) : (
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Mengirim...' : 'Ajukan Klaim'}
                                </Button>
                            )}
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
};

export default PengajuanKlaim;