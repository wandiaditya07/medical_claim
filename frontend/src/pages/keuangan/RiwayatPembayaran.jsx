// src/pages/keuangan/RiwayatPembayaran.jsx
import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarKeuangan from '../../components/keuangan/Sidebar';
import { Table, Card, Badge } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';
import { formatCurrency } from '../../utils/formatCurrency';

const RiwayatPembayaran = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/keuangan/payment-history')
            .then(res => setClaims(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppLayout sidebar={SidebarKeuangan}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-3">Riwayat Pembayaran Klaim</h4>
                <Card className="shadow-sm border-0 rounded-4 p-4">
                    <Table hover responsive>
                        <thead className="table-light">
                            <tr>
                                <th>ID Klaim</th>
                                <th>Nama Karyawan</th>
                                <th>Tanggal Dibayar</th>
                                <th>Jumlah</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="5">Memuat...</td></tr> : claims.map(claim => (
                                <tr key={claim.claim_id}>
                                    <td>#{claim.claim_id}</td>
                                    <td>{claim.employee_name}</td>
                                    <td>{new Date(claim.updated_at).toLocaleString('id-ID')}</td>
                                    <td>{formatCurrency(claim.claim_amount)}</td>
                                    <td><Badge bg="success">{claim.status.replace(/_/g, ' ')}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
};
export default RiwayatPembayaran;