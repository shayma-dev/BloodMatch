import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");
    api
      .get("/me/profile", { headers: { Authorization: "Bearer " + token } })
      .then((res) => setProfile(res.data))
      .catch(() => setError("Failed to fetch profile"));
  }, [navigate]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/auth");
        }}
      >
        Logout
      </button>
    </div>
  );
}
