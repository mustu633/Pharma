import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/invoices");
        setInvoices(data.invoices);
      } catch (err) {
        console.error("Error loading invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  const filtered = invoices.filter(inv =>
    !filter || inv.invoiceNo.toString().includes(filter)
  );

  return (
    <div className="container mt-4">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <h2>Transactions</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by invoice number"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(inv => (
            <tr key={inv._id}>
              <td>{inv.invoiceNo}</td>
              <td>{new Date(inv.date).toLocaleDateString()}</td>
              <td>₨ {inv.totalAfterDiscount.toLocaleString("en-PK")}</td>
              <td>
                <Link to={`/invoices/${inv._id}`} className="btn btn-sm btn-primary">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
