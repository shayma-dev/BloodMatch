const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

// Get my profile
router.get("/me/profile", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { donorProfile: true, requesterProfile: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to get profile", details: e.message });
  }
});

// Update my profile
router.put("/me/profile", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    let data = {};
    if (user.role === "DONOR") {
      const updateData = { ...req.body };
      if (updateData.lastDonationDate) {
        updateData.lastDonationDate = new Date(updateData.lastDonationDate);
      }
      data.donorProfile = { update: updateData };
    } else if (user.role === "REQUESTER") {
      data.requesterProfile = { update: req.body };
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      include: { donorProfile: true, requesterProfile: true },
    });
    res.json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to update profile", details: e.message });
  }
});

module.exports = router;
