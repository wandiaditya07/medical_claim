// src/components/keuangan/SummaryCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const SummaryCard = ({ title, value, note, color }) => (
    <Card className="shadow-sm rounded-4 p-3 border-0 h-100">
        <Card.Body className="p-0">
            <h6 className="text-muted fw-semibold mb-1">{title}</h6>
            <h4 className="fw-bold mb-1">{value}</h4>
            {note && <small className={`text-${color}`}>{note}</small>}
        </Card.Body>
    </Card>
);

export default SummaryCard;