import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SaleSummary from "../components/SaleSummary";
import InventoryStatus from "../components/Products/InventoryStatus";
import Alert from "../components/Alert";

const Dashboard = () => {
  const [productsData, setProductsData] = useState({});
  const [saleData, setSaleData] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);
  const [error, setError] = useState(null);

  // Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const apiUrl = "http://localhost:5000/api";

  const startDate = useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0);
    return d.toISOString().split("T")[0];
  }, []);
  const endDate = useMemo(() => {
    const d = new Date(); d.setHours(23,59,59,999);
    return d.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${apiUrl}/products/inventory/report`, { withCredentials: true });
        setProductsData(productRes.data.report);

        const saleRes = await axios.get(`${apiUrl}/sales/report?startDate=${startDate}&endDate=${endDate}`, { withCredentials: true });
        setSaleData(saleRes.data.report);

        const alertRes = await axios.get(`${apiUrl}/alert/stock-alerts`, { withCredentials: true });
        setLowStock(alertRes.data.lowStockProducts || []);

        const expAlertRes = await axios.get(`${apiUrl}/alert/expiry-alerts`, { withCredentials: true });
        setNearExpiry(expAlertRes.data.nearexpiryProducts || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err);
      }
    };
    fetchData();
  }, [apiUrl, startDate, endDate]);

  const doSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`${apiUrl}/products/search?query=${encodeURIComponent(query)}`, { withCredentials: true });
      setSearchResults(data.products || []);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <div className="dashboard p-3">

      {error && <div className="text-red-600 mb-3">Failed to load dashboard data. Please try again.</div>}

      <div className="card mb-3 m-4">
      <div className="card-body">
        <form className="row g-2" onSubmit={doSearch}>
          <div className="col-md-9">
            <input
              className="form-control"
              placeholder="Search by Name / GTIN / Batch No"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-primary w-100">Search</button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>GTIN</th>
                  <th>Batch</th>
                  <th>Supplier</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.gtin}</td>
                    <td>{p.batchNo}</td>
                    <td>{p.supplier?.name || "—"}</td>
                    <td>{p.quantity || p.stock || 0}</td>
                    <td>Rs {p.price?.toLocaleString("en-PK")}</td>
                    <td>{p.expiryDate ? new Date(p.expiryDate).toISOString().split("T")[0] : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>

      <SaleSummary data={saleData} />
      <hr />

      <InventoryStatus data={productsData} />
      <hr />

      {(lowStock.length > 0 || nearExpiry.length > 0) && (
        <Alert data={lowStock} expData={nearExpiry} />
      )}

      <hr />
    </div>
  );
};

export default Dashboard;
