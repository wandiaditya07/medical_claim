// src/components/karyawan/SummaryCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const SummaryCard = ({ title, value }) => {
    return (
        <Card className="shadow-sm border-0 rounded-4 p-3 h-100">
            <small className="text-muted">{title}</small>
            <h4 className="fw-semibold mt-1">{value}</h4>
        </Card>
    );
};

export default SummaryCard;