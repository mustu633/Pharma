import React from "react";

const InventoryStatus = ({ data }) => {
  const products = data?.products || [];
  const inventoryValue = data?.totalInventoryValue || 0;
  const totalStock = data?.totalStock || 0;

  return (
    <div className="dashboard-section">
      <div className="scrollable-section">
        <h3>Inventory Status</h3>
        <div className="card mb-2">
          <div className="card-body">
            <h5 className="card-title">Stock Status</h5>

            <p className="card-text">
              Total Stock in Inventory:{" "}
              <span className="text-success">{totalStock} items</span>
            </p>
            <p className="card-text">
              Total Stock Value:{" "}
              <span className="text-success">
                &#8360; {inventoryValue.toLocaleString("en-PK")}
              </span>
            </p>

            <table className="table table-hover">
              <thead>
                <tr className="text-center">
                  <th className="bg-info">NAME</th>
                  <th className="bg-info">CATEGORY</th>
                  <th className="bg-info">EXP DATE</th>
                  <th className="bg-info">PRICE</th>
                  <th className="bg-info">STOCK</th>
                  <th className="bg-info">C</th>
                  <th className="bg-info">R</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>
                        {p.expiryDate
                          ? new Date(p.expiryDate).toLocaleDateString("en-CA")
                          : "-"}
                      </td>
                      <td>
                        &#8360;{" "}
                        {p.price ? p.price.toLocaleString("en-PK") : "0"}
                      </td>
                      <td>{p.quantity || 0}</td>
                      <td>{p.C || "-"}</td>
                      <td>{p.R || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
