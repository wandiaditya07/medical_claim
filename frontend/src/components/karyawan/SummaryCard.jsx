import React from "react";
import { Card } from "react-bootstrap";

const SummaryCard = ({ title, value, note, color }) => {
  const textColor = color === "danger" ? "text-danger" : color === "success" ? "text-success" : "text-muted";

  return (
    <Card className="shadow-sm border-0 rounded-4 p-3">
      <h6 className="text-muted mb-1">{title}</h6>
      <h3 className={`fw-semibold ${textColor}`}>{value}</h3>
      <small className={textColor}>{note}</small>
    </Card>
  );
};

export default SummaryCard;