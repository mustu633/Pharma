import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SearchProduct = () => {
  const [gtin, setGtin] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [responseData, setResponseData] = useState("");

  const navigateTo = useNavigate();
  // const apiUrl = process.env.REACT_APP_API_URL;
  const apiUrl = "http://localhost:5000/api";

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!gtin && !batchNo) {
      toast.error("Please enter GTIN or Batch No");
      return;
    }

    const gtinParam = gtin.trim() !== "" ? gtin : "null";
    const batchNoParam = batchNo.trim() !== "" ? batchNo : "null";

    console.log(
      "👉 Sending request to:",
      `${apiUrl}/products/lookup/${gtinParam}/${batchNoParam}`
    );

    try {
      const response = await axios.get(
        `${apiUrl}/products/lookup/${gtinParam}/${batchNoParam}`,
        { withCredentials: true }
      );

      setResponseData(response.data.product);
      setGtin("");
      setBatchNo("");
    } catch (error) {
      console.error("❌ Request failed:", error);
      toast.error(error.response?.data?.message || "Error searching product");
    }
  };

  const handleEdit = (data) => {
    console.log(data, "sent");
    navigateTo("/products/edit", { state: data });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/products/${id}`).then(() => {
        toast.success("Product Deleted Successfully");
        navigateTo("/");
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="mb-3 mt-2 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <div className="m-3 form-section w-100">
        <h2>Search Product</h2>
        <hr />
        <form onSubmit={handleSearch}>
          <label className="m-1" htmlFor="gtin">
            Enter GTIN
          </label>
          <input
            type="text"
            className="form-control"
            id="gtin"
            placeholder="GTIN"
            value={gtin}
            onChange={(e) => setGtin(e.target.value)}
          />

          <label className="m-1 mt-3" htmlFor="batchNo">
            Enter Batch Number
          </label>
          <input
            type="text"
            className="form-control"
            id="batchNo"
            placeholder="Batch Number"
            value={batchNo}
            onChange={(e) => setBatchNo(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-success mt-4 ml-4 fs-5 form-control"
          >
            Search
          </button>
        </form>
      </div>

      {responseData ? (
        <div className="m-2">
          <div className="form-section m-2">
            <h3>FOUND PRODUCT</h3>
            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr className="text-center">
                    <th className="bg-info">NAME</th>
                    <th className="bg-info">CATEGORY</th>
                    <th className="bg-info">STRENGTH</th>
                    <th className="bg-info">DESCRIPTION</th>
                    <th className="bg-info">PRICE</th>
                    <th className="bg-info">QUANTITY</th>
                    <th className="bg-info">GTIN</th>
                    <th className="bg-info">Batch No</th>
                    <th className="bg-info">Serial No</th>
                    <th className="bg-info">Expiry Date</th>
                    <th className="bg-info">R</th>
                    <th className="bg-info">C</th>
                    <th className="bg-info"></th>
                    <th className="bg-info"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{responseData.name}</td>
                    <td>{responseData.category}</td>
                    <td>{responseData.strength}</td>
                    <td>{responseData.desc}</td>
                    <td>
                      &#8360; {responseData.price.toLocaleString("en-PK")}
                    </td>
                    <td>{responseData.quantity}</td>
                    <td>{responseData.gtin}</td>
                    <td>{responseData.batchNo}</td>
                    <td>{responseData.serialNo || "-"}</td>
                    <td>
                      {
                        new Date(responseData.expiryDate)
                          .toISOString()
                          .split("T")[0]
                      }
                    </td>
                    <td>{responseData.R}</td>
                    <td>{responseData.C}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link link-warning p-0"
                        onClick={() => handleEdit(responseData)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link link-danger p-0"
                        onClick={() => handleDelete(responseData._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchProduct;
