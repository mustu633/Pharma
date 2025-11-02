import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Invoice from "../components/Printables/Invoice";
import { Link } from "react-router-dom";

const Sales = () => {
  const [gtin, setGtin] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  const [cart, setCart] = useState([]); // [{ productId, name, gtin, batchNo, expiryDate, price, quantity }]
  const [discountPercent, setDiscountPercent] = useState(0);

  const [invoice, setInvoice] = useState(null);

  const apiUrl = "http://localhost:5000/api";

  // Fetch product by GTIN and/or Batch
  useEffect(() => {
    const fetchData = async () => {
      if (!gtin && !batchNo) {
        setProduct(null);
        return;
      }
      try {
        const gtinParam = gtin.trim() !== "" ? gtin : "null";
        const batchNoParam = batchNo.trim() !== "" ? batchNo : "null";
        const { data } = await axios.get(`${apiUrl}/products/lookup/${gtinParam}/${batchNoParam}`, { withCredentials: true });
        setProduct(data.product || null);
      } catch {
        setProduct(null);
      }
    };
    fetchData();
  }, [gtin, batchNo]);

  const addToCart = () => {
    if (!product) return toast.error("No product selected");

    if (quantity <= 0 || quantity > product.quantity) {
      return toast.error("Invalid quantity");
    }

    const newItem = {
      productId: product._id,
      name: product.name,
      category: product.category,
      gtin: product.gtin,
      batchNo: product.batchNo,
      expiryDate: product.expiryDate,
      price: product.price,
      quantity,
    };

    setCart((prev) => [...prev, newItem]);
    toast.success(`${product.name} added to cart`);

    // reset inputs
    setGtin("");
    setBatchNo("");
    setProduct(null);
    setQuantity(1);
  };

  const removeFromCart = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = +(subtotal * (Number(discountPercent) || 0) / 100).toFixed(2);
  const totalAfterDiscount = +(subtotal - discountAmount).toFixed(2);

  const submitSale = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");

    try {
      const payload = {
        cart: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        discountPercent: Number(discountPercent) || 0,
      };
      const { data } = await axios.post(`${apiUrl}/sales`, payload, { withCredentials: true });

      if (!data.success) throw new Error(data.message || "Sale failed");

      setInvoice(data.invoice);
      setCart([]);
      setDiscountPercent(0);

      toast.success(data.message || "Sale completed");
    } catch (err) {
      toast.error(err.message || "Could not create sale");
    }
  };

  return (
    <div className="container my-4">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Sales Entry</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addToCart();
          }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Enter GTIN</label>
              <input
                autoFocus
                type="text"
                value={gtin}
                placeholder="GTIN"
                className="form-control"
                onChange={(e) => setGtin(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Enter Batch No</label>
              <input
                type="text"
                value={batchNo}
                placeholder="Batch No"
                className="form-control"
                onChange={(e) => setBatchNo(e.target.value)}
              />
            </div>
          </div>

          {product && (
            <div className="row g-3 mt-4">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input type="text" value={product.name} readOnly className="form-control" />
                <small className="text-muted">
                  Supplier: {product.supplier?.name || "—"} | Stock: {product.quantity}
                </small>
              </div>

              <div className="col-md-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  placeholder="Quantity"
                  className="form-control"
                  min="1"
                  max={product.quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-success w-100">
                  <i className="bi bi-cart-plus" /> Add to Cart
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {cart.length > 0 && (
        <div className="card shadow-lg p-4 mt-5">
          <h3 className="mb-3">🛒 Cart</h3>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Batch</th>
                  <th>GTIN</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Line Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.batchNo}</td>
                    <td>{item.gtin}</td>
                    <td>{item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : "—"}</td>
                    <td>{item.quantity}</td>
                    <td>Rs {item.price.toLocaleString("en-PK")}</td>
                    <td>Rs {(item.price * item.quantity).toLocaleString("en-PK")}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row gy-3">
            <div className="col-md-4">
              <label className="form-label">Discount (%) on Total</label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>
            <div className="col-md-8 text-end">
              <p><b>Subtotal:</b> Rs {subtotal.toLocaleString("en-PK")}</p>
              <p><b>Discount ({discountPercent || 0}%):</b> - Rs {discountAmount.toLocaleString("en-PK")}</p>
              <h5><b>Total After Discount:</b> Rs {totalAfterDiscount.toLocaleString("en-PK")}</h5>
            </div>
            <div className="col-12 text-end">
              <button className="btn btn-primary px-4" onClick={submitSale}>
                <i className="bi bi-check2-circle" /> Submit Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {invoice && (
        <div className="mt-5">
          <Invoice invoice={invoice} />
        </div>
      )}
    </div>
  );
};

export default Sales;
