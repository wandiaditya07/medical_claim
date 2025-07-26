// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import DynamicSidebar from '../components/DynamicSidebar';
import apiClient from '../api/axiosConfig';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            setLoading(true);
            // Anda perlu membuat endpoint API baru di backend, contoh: /api/search?q=...
            // apiClient.get(`/search?q=${query}`)
            //     .then(res => setResults(res.data))
            //     .finally(() => setLoading(false));
            
            // Untuk sekarang kita gunakan data dummy
            console.log(`Mencari untuk: "${query}"`);
            setLoading(false);
            setResults([]); // Hasil akan kosong sampai backend dibuat
        }
    }, [query]);

    return (
        <AppLayout sidebar={DynamicSidebar}>
            <div className="container-fluid py-4">
                <h4 className="fw-bold">Hasil Pencarian untuk: "{query}"</h4>
                {loading ? (
                    <p>Mencari...</p>
                ) : results.length > 0 ? (
                    <div>{/* Tampilkan hasil di sini */}</div>
                ) : (
                    <p className="text-muted">Tidak ada hasil yang ditemukan.</p>
                )}
            </div>
        </AppLayout>
    );
};

export default SearchResultsPage;