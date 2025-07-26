import React from 'react';
import { Card } from 'react-bootstrap';

const SummaryCard = ({ title, value, note, color }) => (
  <Card className="border-0 shadow-sm rounded-4 p-3">
    <small className="text-muted">{title}</small>
    <h4 className="fw-semibold mt-1">{value}</h4>
    <span className={`text-${color} small`}>{note}</span>
  </Card>
);

export default SummaryCard;