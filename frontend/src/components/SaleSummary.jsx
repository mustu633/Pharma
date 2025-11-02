import React from "react";

const SaleSummary = ({ data = {} }) => {
  const {
    startDate,
    subtotalBefore = 0,
    totalAfterDiscount,
    totalItemsSold = 0,
    aggregatedProducts = [],
  } = data || {};


  return (
    <div className="dashboard-section">
      <div className="scrollable-section">
      <h3>Sale Summary</h3>
      <div className="card">
        <div className="card-body">
          <p>
            Date :  {startDate}
          </p>
          <p className="card-text">
            Subtotal (Before Discount) :{" "}
            <span>₨ {subtotalBefore.toLocaleString("en-PK")}</span>
          </p>
          <p className="card-text">
            Subtotal (After Discount) :{" "}
            <span>₨ {totalAfterDiscount}</span>
          </p>
          <p className="card-text">
            Total items sold:{" "}
            <span className="text-success">{totalItemsSold} items</span>
          </p>

          <hr />
          <div className="table-responsive">
            <table className="table table-hover mt-2">
              <thead>
                <tr className="text-center">
                  <th className="bg-success">NAME</th>
                  <th className="bg-success">CATEGORY</th>
                  <th className="bg-success">GTIN</th>
                  <th className="bg-success">BATCH NO</th>
                  <th className="bg-success">QUANTITY</th>
                  <th className="bg-success">AMOUNT (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedProducts.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.gtin}</td>
                    <td>{p.batchNo}</td>
                    <td>{p.quantity}</td>
                    <td>₨ {p.amount?.toLocaleString("en-PK")}</td>
                  </tr>
                ))}
                {aggregatedProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-3">
                      No sales for selected range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default SaleSummary;
