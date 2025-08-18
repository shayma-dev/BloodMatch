require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/profile"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
