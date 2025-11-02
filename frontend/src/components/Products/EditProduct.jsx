import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductsList = () => {
  const location = useLocation();
  const data = location.state;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const navigateTo = useNavigate();
  const apiUrl = "http://localhost:5000/api";

  useEffect(() => {
    if (data) {
      setName(data.name);
      setCategory(data.category);
      setDesc(data.desc);
      setPrice(
        data.price
          ? data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") // format with commas
          : ""
      );
      setQuantity(data.quantity);
      setExpiryDate(
        data.expiryDate
          ? new Date(data.expiryDate).toISOString().split("T")[0] // YYYY-MM-DD
          : ""
      );
    }
  }, [data]);

  const updateProduct = async (e) => {
    e.preventDefault();
  
    try {
      // Format price: remove commas, convert to number
      const formattedPrice = price ? Number(price.replace(/,/g, "")) : 0;
  
      const updatedProduct = {
        name,
        category,
        desc,
        price: formattedPrice,
        quantity,
        expiryDate,
      };
  
      // Get token if using JWT auth
      const token = localStorage.getItem("token");
  
      await axios.put(`${apiUrl}/products/${data._id}`, updatedProduct, {
        withCredentials: true, // needed if using cookie-based auth
        headers: token
          ? { Authorization: `Bearer ${token}` } // attach JWT if available
          : {},
      });
  
      toast.success("Product updated successfully");
      navigateTo("/products");
    } catch (error) {
      console.error("Update error:", error.response || error);
      toast.error(
        error.response?.data?.message || "❌ Could not update product"
      );
    }
  };
  

  return (
    <div className="form-section">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/products" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <h2>Edit Product</h2>
      <form className="form" onSubmit={updateProduct}>
        <div className="form-group m-2">
          <label className="m-1" htmlFor="productname">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="productname"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group m-2">
          <label className="m-1" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            className="form-control"
            id="category"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group m-2">
          <label className="m-1" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            className="form-control"
            id="price"
            placeholder="e.g. 10,000"
            value={price}
            onChange={(e) => {
              // allow only numbers and commas
              const val = e.target.value.replace(/[^0-9,]/g, "");
              setPrice(val.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }}
          />
        </div>

        <div className="form-group m-2">
          <label className="m-1" htmlFor="quantity">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group m-2">
          <label className="m-1" htmlFor="expiryDate">
            Expiry Date
          </label>
          <input
            type="date"
            className="form-control"
            id="expiryDate"
            placeholder="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="form-group m-2">
          <label className="m-1" htmlFor="desc">
            Description
          </label>
          <textarea
            placeholder="Description"
            className="form-control"
            value={desc}
            cols="30"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <br />
        <div>
        <button type="submit" className="btn btn-success mx-4 mt-4 fs-5">
          UPDATE
        </button>
        <button
          type="button"
          onClick={() => navigateTo("/products")}
          className="btn btn-secondary mx-4 mt-4 fs-5"
        >
          BACK
        </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsList;
