import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Purchase = () => {
  const [product, setProduct] = useState(null);
  const [suppliers, setSuppliers] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [productData, setProductData] = useState(null);
  const [purchasePrice, setPurchasePrice] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null);
  const { refresh, setRefresh } = useState(false);
  // const apiUrl = process.env.REACT_APP_API_URL;
  const apiUrl = "http://localhost:5000/api";



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`,{
          withCredentials: true, // Ensure this if backend needs it
        });
        setProductData(response.data.products);
        //get purchases
        const res = await axios.get(`${apiUrl}/purchases`,{
          withCredentials: true, // Ensure this if backend needs it
        });
        setPurchaseData(res.data.purchases);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = productData.find(
      (product) => product._id === selectedProductId
    );

    setProduct(selectedProductId);
    setSuppliers(selectedProduct ? selectedProduct.supplier : "");
  };

  const addPurchase = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/purchases`, {
        product,
        supplier: suppliers._id,
        quantity,
        purchasePrice,
      },{
        withCredentials: true, // Ensure this if backend needs it
      });

      setProduct(null);
      setSuppliers("");
      setQuantity(null);
      setPurchasePrice(null);
      setRefresh(!refresh);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="container-fluid m-3">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <div className="form-section m-2">
        <h3 className="text-center">Make Purachase</h3>
        <hr />
        <form onSubmit={addPurchase} className="form">
          <div className="form-group m-2">
            <label htmlFor="">Product:</label>
            <select className="form-select" onChange={handleProductChange}>
              <option selected disabled>
                Products
              </option>

              {productData &&
                productData.map((p, index) => {
                  return (
                    <option value={p._id} key={index}>
                      {p.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="form-group m-2">
            <label htmlFor="">Supplier:</label>
            <input
              type="text"
              className="form-control"
              value={suppliers.name}
              readOnly
            />
          </div>
          <div className="form-group m-2">
            <label htmlFor="">Quantity</label>
            <input
              className="form-control"
              type="number"
              value={quantity}
              placeholder="Qunatity"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="form-group m-2">
            <label htmlFor="">Price</label>
            <input
              className="form-control"
              type="number"
              value={purchasePrice}
              placeholder="Qunatity"
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>
          <button className="btn btn-success mt-4 ml-4 fs-5  form-control" type="submit">
            ADD
          </button>
        </form>
      </div>
      <div className="form-section m-2">
        <h3 className="tect-center">Purachases List</h3>
        <hr />
        <table className="table">
        <thead>
            <tr className="text-center">
            <th className="bg-info">Product</th>
            <th className="bg-info">Supllier</th>
            <th className="bg-info">Qunatity</th>
            <th className="bg-info">Price</th>
          </tr>
          </thead>
          <tbody>
          {purchaseData &&
            purchaseData.map((pd, index) => {
              return (
                <tr key={index}>
                  <td>{pd.product.name}</td>
                  <td>{pd.supplier.name}</td>
                  <td>{pd.quantity}</td>
                  <td>{pd.purchasePrice}</td>
                </tr>
              );
            })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchase;
