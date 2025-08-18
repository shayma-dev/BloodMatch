import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Auth() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const defaultRole = params.get("role") || "DONOR";
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    bloodType: "",
    lastDonationDate: "",
    city: "",
    country: "",
    addressLine: "",
    category: "HOSPITAL",
    role: defaultRole,
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await api.post("/auth/signup", form);
        setIsSignup(false);
      } else {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>
        {isSignup ? "Sign Up" : "Log In"} as {form.role}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        {isSignup && (
          <>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <br />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <br />
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
            <br />
            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
            />
            <br />
            <input
              name="addressLine"
              placeholder="Address (optional)"
              value={form.addressLine}
              onChange={handleChange}
            />
            <br />
            {form.role === "DONOR" ? (
              <>
                <input
                  name="bloodType"
                  placeholder="Blood Type (A+, O-, etc)"
                  value={form.bloodType}
                  onChange={handleChange}
                  required
                />
                <br />
                <input
                  name="lastDonationDate"
                  type="date"
                  placeholder="Last Donation Date"
                  value={form.lastDonationDate}
                  onChange={handleChange}
                  required
                />
                <br />
              </>
            ) : (
              <>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="HOSPITAL">Hospital</option>
                  <option value="PATIENT">Patient</option>
                </select>
                <br />
              </>
            )}
          </>
        )}
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
      </form>
      <button onClick={() => setIsSignup((s) => !s)} style={{ marginTop: 10 }}>
        {isSignup
          ? "Already have an account? Log In"
          : "Need an account? Sign Up"}
      </button>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </div>
  );
}
