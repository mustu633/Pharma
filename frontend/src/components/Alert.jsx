import React from "react";

const Alert = ({ data, expData }) => {
  return (
    <div>
      <div className="dashboard-section">
        <h3>Notifications & Alerts</h3>
        <hr />
        <div className="scrollable-section">

          {/* Stock Alerts */}
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Stock Alerts</h3>
              <table className="table table-hover">
                <thead>
                  <tr className="text-center">
                    <th className="bg-danger">NAME</th>
                    <th className="bg-danger">CATEGORY</th>
                    <th className="bg-danger">GTIN</th>
                    <th className="bg-danger">Batch No</th>
                    <th className="bg-danger">STOCK</th>
                    <th className="bg-danger">C</th>
                    <th className="bg-danger">R</th>
                  </tr>
                </thead>
                {data &&
                  data.map((d, index) => (
                    <tbody key={index}>
                      <tr>
                        <td className="text-danger">{d.name}</td>
                        <td>{d.category}</td>
                        <td>{d.gtin}</td>
                        <td>{d.batchNo}</td>
                        <td className="text-danger">{d.quantity}</td>
                        <td>{d.C}</td>
                        <td>{d.R}</td>
                      </tr>
                    </tbody>
                  ))}
              </table>
              <hr />
            </div>
          </div>

          {/* Expiry Alerts */}
          <div className="card mt-3">
            <div className="card-body">
              <h3 className="card-title">Expiry Alerts</h3>
              <table className="table table-hover">
                <thead>
                  <tr className="text-center">
                    <th className="bg-danger">NAME</th>
                    <th className="bg-danger">CATEGORY</th>
                    <th className="bg-danger">GTIN</th>
                    <th className="bg-danger">Batch No</th>
                    <th className="bg-danger">Exp DATE</th>
                    <th className="bg-danger">C</th>
                    <th className="bg-danger">R</th>
                  </tr>
                </thead>
                {expData &&
                  expData.map((d, index) => (
                    <tbody key={index}>
                      <tr>
                        <td className="text-danger">{d.name}</td>
                        <td>{d.category}</td>
                        <td>{d.gtin}</td>
                        <td>{d.batchNo}</td>
                        <td className="text-danger">
                          {new Date(d.expiryDate).toISOString().split("T")[0]}
                        </td>
                        <td>{d.C}</td>
                        <td>{d.R}</td>
                      </tr>
                    </tbody>
                  ))}
              </table>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
