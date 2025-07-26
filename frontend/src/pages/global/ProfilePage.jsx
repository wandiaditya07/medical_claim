// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import DynamicSidebar from '../../components/DynamicSidebar';
import { Card, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import apiClient from '../../api/axiosConfig';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiClient.get('/users/me')
            .then(res => setProfile(res.data))
            .catch(() => setError('Gagal memuat data profil.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AppLayout sidebar={DynamicSidebar}>
                <div className="container-fluid py-4 text-center">
                    <p>Memuat profil...</p>
                </div>
            </AppLayout>
        );
    }
    
    if (error) {
        return (
            <AppLayout sidebar={DynamicSidebar}>
                <div className="container-fluid py-4">
                    <Alert variant="danger">{error}</Alert>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout sidebar={DynamicSidebar}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-4">Profil Saya</h4>
                <Card className="shadow-sm border-0 rounded-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={4} className="text-center mb-4 mb-md-0">
                                <FaUserCircle size={150} className="text-secondary" />
                                <h5 className="mt-3">{profile?.full_name}</h5>
                                <p className="text-muted">{profile?.role}</p>
                            </Col>

                            <Col md={8}>
                                <Tabs defaultActiveKey="account" id="profile-tabs" className="mb-3">
                                    <Tab eventKey="account" title="Informasi Akun">
                                        <div className="p-3">
                                            <p><strong>Nama Lengkap:</strong> {profile?.full_name}</p>
                                            <p><strong>Email:</strong> {profile?.email}</p>
                                            <p><strong>Peran Sistem:</strong> <span className="badge bg-primary">{profile?.role}</span></p>
                                        </div>
                                    </Tab>

                                    {/* --- PERUBAHAN DI SINI --- */}
                                    {/* Tab ini hanya akan dirender jika peran pengguna adalah KARYAWAN */}
                                    {profile?.role === 'KARYAWAN' && (
                                        <Tab eventKey="employee" title="Data Karyawan">
                                            <div className="p-3">
                                                {profile?.employee_nik ? (
                                                    <>
                                                        <p><strong>NIK:</strong> {profile.employee_nik}</p>
                                                        <p><strong>Jabatan:</strong> {profile.position}</p>
                                                        <p><strong>Divisi:</strong> {profile.department}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-muted">Tidak ada data karyawan yang terhubung dengan akun ini.</p>
                                                )}
                                            </div>
                                        </Tab>
                                    )}
                                </Tabs>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </AppLayout>
    );
};

export default ProfilePage;