import React from "react";

const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <div className="card shadow-sm p-3 d-flex flex-row align-items-center" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="me-3 fs-3" style={{ color }}>{icon}</div>
      <div>
        <h6 className="text-muted mb-1">{title}</h6>
        <h4 className="fw-bold mb-0">{value}</h4>
      </div>
    </div>
  );
};

export default SummaryCard;