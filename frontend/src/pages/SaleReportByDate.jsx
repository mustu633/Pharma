import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Link } from "react-router-dom";

const SalesReportByDate = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [startDate, endDate] = dateRange;
  const apiUrl = "http://localhost:5000/api";
  
  const fetchReport = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      const startString = startDate.toISOString().split("T")[0];
      const endString = endDate.toISOString().split("T")[0];

      const { data } = await axios.get(
        `${apiUrl}/sales/report/by-date?startDate=${startString}&endDate=${endString}`
      );
      setSalesData(data.report);
    } catch (err) {
      console.error("Error fetching sales report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-4 text-primary">Custom Sales Report</h2>

          <div className="d-flex align-items-center mb-3">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Select date range"
              className="form-control w-auto"
            />

            <button onClick={fetchReport} className="btn btn-success ms-3">
              <i className="bi bi-graph-up"></i> Get Report
            </button>
          </div>

          {loading && (
            <div className="alert alert-info mt-3">
              <div className="spinner-border spinner-border-sm me-2"></div>
              Loading report...
            </div>
          )}

          {salesData && (
            <div className="mt-4">
              <h3 className="h5 mb-3 text-secondary">
                Report ({salesData.startDate} → {salesData.endDate})
              </h3>

              <div className="mb-3">
                <p className="mb-1">
                  <strong>Total (After Discounts):</strong>{" "}
                  <span className="text-success fw-bold">
                    Rs {salesData.totalAfterDiscount.toLocaleString("en-PK")}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Subtotal (Before Discount):</strong>{" "}
                  <span>
                    Rs {salesData.subtotalBefore.toLocaleString("en-PK")}
                  </span>
                </p>
                <p className="mb-0">
                  <strong>Total Items Sold:</strong>{" "}
                  <span className="fw-bold">{salesData.totalItemsSold}</span>
                </p>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>GTIN</th>
                      <th>Batch</th>
                      <th>Qty</th>
                      <th>Amount (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.aggregatedProducts.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>{p.gtin}</td>
                        <td>{p.batchNo}</td>
                        <td>{p.quantity}</td>
                        <td>Rs {p.amount?.toLocaleString("en-PK")}</td>
                      </tr>
                    ))}
                    {salesData.aggregatedProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          No data for selected dates.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReportByDate;
