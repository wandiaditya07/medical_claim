import React from "react";
import { Card } from "react-bootstrap";

const SummaryCard = ({ data }) => {
  return (
    <div className="row g-4 mb-4">
      {data.map((item, index) => (
        <div className="col-md-3" key={index}>
          <Card className="shadow-sm rounded-4 p-3 border-0 h-100">
            <Card.Body className="p-0">
              <h6 className="text-muted fw-semibold mb-1">{item.title}</h6>
              <h4 className="fw-bold mb-1">{item.value}</h4>
              <small className={`text-${item.color}`}>{item.note}</small>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SummaryCard;
