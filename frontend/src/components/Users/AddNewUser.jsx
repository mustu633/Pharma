import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddNewUser = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // const apiUrl = process.env.REACT_APP_API_URL;
  const apiUrl = "http://localhost:5000/api";

  const [repPassword, setRepPassword] = useState("");

  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === repPassword) {
        const response = await axios.post(
          `${apiUrl}/users/register`,
          {
            username: userName,
            password,
          },
          {
            withCredentials: true, // Ensure this if backend needs it
          }
        );
        toast.success(response.data.message);
        navigateTo("/");
      } else {
        toast.error("Password and Confirm Do Not Match");
      }
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error)
    }
  };

  return (
    <div className="form-section ms-5 w-75 mt-5">
      <div className="mb-3 d-flex back-btn-box">
          <Link to="/" className="primary-btn bg-info">
            <i className="bi bi-arrow-left"> Go Back</i>
          </Link>
        </div>
      <h3 className="text-center">Add New User</h3>
      <hr />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group m-2">
          <label className="m-1" htmlFor="username">
            User Name
          </label>
          <input
            placeholder="USERNAME"
            type="text"
            className="form-control"
            id="username"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="form-group m-2">
          <label className="m-1" htmlFor="password">
            Password
          </label>
          <input
            placeholder="PASSWORD"
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="form-group m-2">
          <label className="m-1" htmlFor="confirmpass">
            Confirm Password
          </label>
          <input
            placeholder="CONFIRM"
            type="password"
            className="form-control"
            id="confirmpass"
            value={repPassword}
            onChange={(e) => {
              setRepPassword(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success mt-4 ml-4 fs-5  ">
            ADD
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewUser;
