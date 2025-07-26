import React, { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import SidebarHRD from '../../components/hrd/Sidebar';
import { Table, Alert, Card } from 'react-bootstrap';
import apiClient from '../../api/axiosConfig';

const HistoryPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/logs');
                setLogs(response.data);
            } catch (err) {
                setError('Gagal memuat histori aktivitas.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <AppLayout sidebar={SidebarHRD}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold mb-3">Histori Aktivitas Sistem</h4>
                {error && <Alert variant="danger">{error}</Alert>}
                <Card className="shadow-sm border-0 rounded-4">
                    <Card.Body>
                        <Table hover responsive="sm">
                            <thead className="table-light">
                                <tr>
                                    <th>Waktu</th>
                                    <th>Pengguna</th>
                                    <th>Aksi</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center">Memuat...</td></tr>
                                ) : logs.map((log, index) => (
                                    <tr key={index}>
                                        <td>{new Date(log.created_at).toLocaleString('id-ID')}</td>
                                        <td>{log.user_name}</td>
                                        <td><span className="badge bg-info">{log.action_type.replace(/_/g, ' ')}</span></td>
                                        <td>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        </AppLayout>
    );
};

export default HistoryPage;