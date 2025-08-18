import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>BloodMatch</h1>
      <h2>How can we help you today?</h2>
      <button onClick={() => navigate("/auth?role=REQUESTER")}>
        I need blood
      </button>
      <button
        onClick={() => navigate("/auth?role=DONOR")}
        style={{ marginLeft: 16 }}
      >
        I can donate
      </button>
    </div>
  );
}
