import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewProduct = () => {
  const [name, setName] = useState("");
  const [strength, setStrength] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gtin, setGtin] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [C, setC] = useState("");
  const [R, setR] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierData, setSupplierData] = useState([]);

  const navigateTo = useNavigate();
  const apiUrl = "http://localhost:5000/api";

  // Fetch suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/suppliers`, {
          headers: {
            Authorization: `Bearer ${token}`,   // ✅ include token
          },
        });
        setSupplierData(response.data.suppliers);
      } catch (error) {
        toast.error("Could not fetch suppliers");
      }
    };
    fetchData();
  }, []);

  // Add new product
  const addNewProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // ✅ get token from storage
      const data = {
        name,
        strength,
        category,
        desc,
        price,
        quantity,
        gtin,
        batchNo,
        serialNo,
        expiryDate,
        C,
        R,
        supplier,
      };

      await axios.post(`${apiUrl}/products`, data, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,   // ✅ send token with request
        },
      });

      toast.success("Product added successfully!");

      // reset form
      setName("");
      setStrength("");
      setCategory("");
      setDesc("");
      setPrice("");
      setQuantity("");
      setGtin("");
      setBatchNo("");
      setSerialNo("");
      setExpiryDate("");
      setC("");
      setR("");
      setSupplier("");

      navigateTo("/products"); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="form-section">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <h2 className="heading mt-3 mb-3 text-center">ADD NEW PRODUCT</h2>
      <hr />
      <form className="form" onSubmit={addNewProduct}>
        {/* Product Name */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="productname">Product Name</label>
          <input type="text" className="form-control" id="productname" placeholder="Name"
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Strength */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="strength">Strength</label>
          <input type="text" className="form-control" id="strength" placeholder="e.g. 500mg, 15g"
            value={strength} onChange={(e) => setStrength(e.target.value)} />
        </div>

        {/* Category */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="category">Category</label>
          <input type="text" className="form-control" id="category" placeholder="Category"
            value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        {/* Price */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="price">Price</label>
          <input type="number" className="form-control" id="price" placeholder="Price"
            value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        {/* Quantity */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="quantity">Quantity</label>
          <input type="number" className="form-control" id="quantity" placeholder="Quantity"
            value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        {/* GTIN */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="gtin">GTIN</label>
          <input type="text" className="form-control" id="gtin" placeholder="08964001712718"
            value={gtin} onChange={(e) => setGtin(e.target.value)} />
        </div>

        {/* Batch No */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="batchNo">Batch No</label>
          <input type="text" className="form-control" id="batchNo" placeholder="4235"
            value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
        </div>

        {/* Serial No */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="serialNo">Serial No (optional)</label>
          <input type="text" className="form-control" id="serialNo" placeholder="12345"
            value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
        </div>

        {/* Expiry Date */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="expiryDate">Expiry Date</label>
          <input type="date" className="form-control" id="expiryDate"
            value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </div>

        {/* Shelf Column (C) */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="C">Shelf Column (C)</label>
          <input type="text" className="form-control" id="C" placeholder="e.g. 3"
            value={C} onChange={(e) => setC(e.target.value)} />
        </div>

        {/* Shelf Row (R) */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="R">Shelf Row (R)</label>
          <input type="text" className="form-control" id="R" placeholder="e.g. 2"
            value={R} onChange={(e) => setR(e.target.value)} />
        </div>

        {/* Supplier */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="Supplier">Supplier</label>
          <select onChange={(e) => setSupplier(e.target.value)}
            className="form-select" value={supplier}>
            <option disabled value="">Select Supplier</option>
            {supplierData && supplierData.map((sd, index) => (
              <option value={sd._id} key={index}>{sd.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group m-2">
          <label className="m-1" htmlFor="Description">Description</label>
          <textarea placeholder="Description" className="form-control" id="Description"
            value={desc} cols="30" onChange={(e) => setDesc(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-success mt-4 ml-4 fs-5 form-control ">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddNewProduct;