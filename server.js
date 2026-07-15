require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const adminAuth = require("./middleware/adminAuth");

const app = express();

app.use(cors());
app.use(express.json());

// Serves index.html, script.js, style.css, images, etc.
app.use(express.static(path.join(__dirname, "public")));

// Public API
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Protected admin API + dashboard page
app.use("/api/admin", adminAuth, adminRoutes);
app.get("/admin", adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Gowtham Mess server running on http://localhost:${PORT}`);
  });
});
