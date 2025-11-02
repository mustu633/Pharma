import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const apiUrl = "http://localhost:5000/api"; // replace with process.env.REACT_APP_API_URL in prod

  const [filter, setFilter] = useState("");

  const filteredProducts = productsData.filter((p) => {
    return (
      !filter ||
      p.name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.gtin?.toLowerCase().includes(filter.toLowerCase()) ||
      p.batchNo?.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await axios.get(`${apiUrl}/products`, {
          withCredentials: true, // in case cookies/tokens are needed
        });
        setProductsData(products.data.products);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch product data");
      }
    };
    fetchData();
  }, [refresh]);

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/products/${id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast.success("✅ Product deleted successfully");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Delete error:", error.response || error);
      toast.error(
        error.response?.data?.message || "❌ Failed to delete product"
      );
    }
  };

  const editProduct = (data) => {
    navigateTo("/products/edit", { state: data });
  };

  return (
    <div className="form-contaier m-3 w-100 p-5">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <div className="table-responsive">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Filter by GTIN / Batch No / name"
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <table className="table table-hover">
          <thead>
            <tr className="text-center">
              <th className="bg-info">NAME</th>
              <th className="bg-info">STRENGTH</th>
              <th className="bg-info">CATEGORY</th>
              <th className="bg-info">GTIN</th>
              <th className="bg-info">Batch No</th>
              <th className="bg-info">Serial No</th>
              <th className="bg-info">PRICE</th>
              <th className="bg-info">STOCK</th>
              <th className="bg-info">Exp Date</th>
              <th className="bg-info">C</th>
              <th className="bg-info">R</th>
              <th className="bg-info"></th>
              <th className="bg-info"></th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.strength}</td>
                <td>{p.category}</td>
                <td>{p.gtin}</td>
                <td>{p.batchNo}</td>
                <td>{p.serialNo || "-"}</td>
                <td>&#8360; {p.price.toLocaleString("en-PK")}</td>
                <td>{p.quantity}</td>
                <td>
                  {p.expiryDate
                    ? new Date(p.expiryDate).toISOString().split("T")[0]
                    : "-"}
                </td>
                <td>{p.C}</td>
                <td>{p.R}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-link link-warning p-0"
                    onClick={() => editProduct(p)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-link link-danger p-0"
                    onClick={() => deleteProduct(p._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
