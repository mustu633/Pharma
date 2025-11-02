import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BackupPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = "http://localhost:5000/api";

  const startBackup = async () => {
    try {
      setLoading(true);
      setMessage("⏳ Backup started...");

      const { data } = await axios.post(`${apiUrl}/backup`);

      if (data.success) {
        setMessage(data.message);
      } else {
        setMessage("❌ Backup failed.");
      }
    } catch (err) {
      console.error("Error creating backup:", err);
      setMessage("❌ Backup failed. Check server logs.");
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
          <h2 className="h4 mb-4 text-primary">
            <i className="bi bi-hdd-network me-2"></i> Database Backup
          </h2>

          <div className="d-flex align-items-center mb-3">
            <button
              onClick={startBackup}
              className="btn btn-success"
              disabled={loading}
            >
              <i className="bi bi-cloud-arrow-down me-2"></i> Start Backup
            </button>
          </div>

          {loading && (
            <div className="alert alert-info mt-3">
              <div className="spinner-border spinner-border-sm me-2"></div>
              Backup is running...
            </div>
          )}

          {message && !loading && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              } mt-3`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupPage;
