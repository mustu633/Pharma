import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../components/Printables/invoice.css"; // ✅ same CSS

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/invoices/${id}`);
        setInvoice(data.invoice);
      } catch (err) {
        console.error("Error loading invoice:", err);
      }
    };
    fetchInvoice();
  }, [id]);

  const printInvoice = () => window.print();

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="form-contaier m-3 w-100">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/invoices" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
    <div id="invoice" className="invoice-container">
      <div className="invoice-header">
        <div>
          <p>Date: {new Date(invoice.date || invoice.createdAt).toLocaleDateString()}</p>
          <p>Invoice #: {invoice.invoiceNo}</p>
        </div>

        <div className="invoice-company">
          <div>
            <h3>LUCKY</h3>
            <span><b>Medical Store & Cosmetics Center</b></span>
          </div>
          <div className="invoice-address-box">
            <p>Asghar Chowk, Karasmathang, Skardu</p>
            <p>essaa4738@gmail.com</p>
            <p>+92 3465517275</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine</th>
            <th>GTIN</th>
            <th>Batch No</th>
            <th>Expiry</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.products.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.gtin}</td>
              <td>{item.batchNo}</td>
              <td>{item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : "—"}</td>
              <td>{item.quantity}</td>
              <td>₨ {item.price.toLocaleString("en-PK")}</td>
              <td>₨ {item.total.toLocaleString("en-PK")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="invoice-summary">
        <p><b>Sub-Total:</b> ₨ {invoice.subtotal.toLocaleString("en-PK")}</p>
        <p><b>Discount:</b> {invoice.discountPercent}%</p>
        <p><b>Total:</b> ₨ {invoice.totalAfterDiscount.toLocaleString("en-PK")}</p>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <p>Thank you for your purchase!</p>
        <p><em>This is a computer-generated invoice and does not require a signature.</em></p>
      </div>

      {/* Print Button */}
      <div className="invoice-print">
        <button onClick={printInvoice} className="btn btn-success">
          Print Invoice
        </button>
      </div>
    </div>
    </div>
  );
};

export default InvoiceDetail;
