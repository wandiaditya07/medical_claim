import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKaryawan from '../../components/karyawan/Sidebar';
import { Table, Alert, Card, Badge } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'DIBAYARKAN_KEUANGAN': return 'success';
        case 'DISETUJUI_HRD': return 'info';
        case 'DITOLAK_HRD': return 'danger';
        case 'PENGAJUAN': default: return 'warning';
    }
};

const RiwayatKlaim = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClaims = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/claims');
                setClaims(response.data);
            } catch (err) {
                setError('Gagal memuat riwayat klaim.');
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    return (
        <AppLayout sidebar={SidebarKaryawan}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-3">Riwayat Klaim Saya</h4>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Card className="shadow-sm border-0 rounded-4">
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID Klaim</th>
                                        {/* PERUBAHAN 1: Tambah kolom Pasien */}
                                        <th>Pengaju</th>
                                        <th>Tanggal Pengajuan</th>
                                        <th>Jumlah</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center">Memuat...</td></tr>
                                    ) : claims.length > 0 ? (
                                        claims.map((claim) => (
                                            <tr key={claim.claim_id}>
                                                <td>#{claim.claim_id}</td>
                                                {/* PERUBAHAN 2: Tampilkan nama pasien */}
                                                <td>
                                                    {claim.dependent_name ? (
                                                        <>
                                                            {claim.dependent_name} <br/>
                                                            <small className="text-muted">(Tanggungan)</small>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {claim.employee_name} <br/>
                                                            <small className="text-muted">(Diri Sendiri)</small>
                                                        </>
                                                    )}
                                                </td>
                                                <td>{new Date(claim.claim_date).toLocaleDateString('id-ID')}</td>
                                                <td>{formatCurrency(claim.claim_amount)}</td>
                                                <td className="text-center">
                                                    <Badge 
                                                        pill 
                                                        bg={getStatusBadgeVariant(claim.status)}
                                                        text={claim.status === 'PENGAJUAN' ? 'dark' : 'white'}
                                                    >
                                                        {claim.status.replace(/_/g, ' ')}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center text-muted">Anda belum pernah mengajukan klaim.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </AppLayout>
    );
};

export default RiwayatKlaim;