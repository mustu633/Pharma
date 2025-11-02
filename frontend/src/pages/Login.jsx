import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState(""); // fixed typo
  const navigateTo = useNavigate();
  // const apiUrl = process.env.REACT_APP_API_URL;
  const apiUrl = "http://localhost:5000/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/users/login`,
        { username: userName, password },
        { withCredentials: true }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      // optional: store user info too
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      toast.success(response.data.message || "Login successful!");
      setUserName("");
      setPassword("");

      navigateTo("/"); // later you can redirect based on role here
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mx-auto text-primary mt-5" style={{ width: "200px" }}>
        LOGIN
      </h2>
      <div className="form-section mx-auto mt-5 w-75">
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group w-100">
            <label htmlFor="userid">UserName</label>
            <input
              type="text"
              id="userid"
              value={userName}
              className="form-control mb-2"
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter User Name"
            />
          </div>
          <div className="form-group w-100">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              className="form-control mb-2"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <button type="submit" className="btn btn-secondary form-control">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
