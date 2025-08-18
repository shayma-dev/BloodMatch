const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

// Signup
router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    role,
    name,
    phone,
    bloodType,
    lastDonationDate,
    city,
    country,
    addressLine,
    category,
  } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ error: "Missing required fields" });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    let userData = { email, passwordHash, role };
    if (role === "DONOR") {
      userData.donorProfile = {
        create: {
          name,
          phone,
          bloodType,
          lastDonationDate: new Date(lastDonationDate),
          city,
          country,
          addressLine,
          photoURL: null,
        },
      };
    } else if (role === "REQUESTER") {
      userData.requesterProfile = {
        create: { name, category, phone, city, country, addressLine },
      };
    }
    const user = await prisma.user.create({ data: userData });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: "Signup failed", details: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: "Login failed", details: e.message });
  }
});

module.exports = router;
