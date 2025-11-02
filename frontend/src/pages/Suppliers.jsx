import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Suppliers = () => {
  const [supplier, setSupplier] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigateTo = useNavigate();
  const apiUrl = "http://localhost:5000/api";

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/suppliers`, {
          withCredentials: true,
        });
        setSupplier(response.data.suppliers);
      } catch (error) {
        toast.error("Could not fetch suppliers");
      }
    };
    fetchData();
  }, [refresh]);

  const addNewSupplier = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        contactInfo: { email, phone, address },
      };
      const response = await axios.post(`${apiUrl}/suppliers`, data, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setRefresh(!refresh);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding supplier");
    }
  };

  const editSupplier = (data) => {
    navigateTo("/suppliers/edit", { state: data });
  };

  const deleteSupplier = async (id) => {
    try {
      const data = await axios.delete(`${apiUrl}/suppliers/${id}`, {
        withCredentials: true,
      });
      toast.success(data.data.message);
      setRefresh(!refresh);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting supplier");
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
        <h3 className="text-center">Add new Supplier</h3>
        <hr />
        <form className="form" onSubmit={addNewSupplier}>
          <div className="form-group m-2">
            <label className="m-1">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-1">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-1">Phone</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-1">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success mt-4 ml-4 fs-5 form-control"
          >
            ADD
          </button>
        </form>
      </div>

      <div className="form-section m-2">
        <div className="scrollable-section">
          <h3>Suppliers</h3>
          <hr />
          <table className="table table-hover">
            <thead>
              <tr className="text-center">
                <th className="bg-info">NAME</th>
                <th className="bg-info">EMAIL</th>
                <th className="bg-info">PHONE</th>
                <th className="bg-info">ADDRESS</th>
                <th className="bg-info"></th>
                <th className="bg-info"></th>
              </tr>
            </thead>
            <tbody>
              {supplier &&
                supplier.map((s, index) => (
                  <tr key={index}>
                    <td>{s.name}</td>
                    <td>{s.contactInfo.email}</td>
                    <td>{s.contactInfo.phone}</td>
                    <td>{s.contactInfo.address}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link link-warning p-0"
                        onClick={() => editSupplier(s)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link link-danger p-0"
                        onClick={() => deleteSupplier(s._id)}
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
    </div>
  );
};

export default Suppliers;
