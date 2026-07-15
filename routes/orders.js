const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

async function generateOrderNo() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const countToday = await Order.countDocuments({
    created_at: { $gte: startOfDay, $lte: endOfDay }
  });

  const seq = String(countToday + 1).padStart(3, "0");
  return `GM-${dateStr}-${seq}`;
}

router.post("/", async (req, res) => {
  const {
    customer_name,
    phone,
    email,
    delivery_type,
    address,
    items,
    total,
    payment_method,
    payment_status,
    razorpay_order_id,
    razorpay_payment_id
  } = req.body;

  if (!customer_name || !phone || !Array.isArray(items) || items.length === 0 || !total) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  try {
    const order_no = await generateOrderNo();

    const order = await Order.create({
      order_no,
      customer_name,
      phone,
      email: email || undefined,
      delivery_type: delivery_type || "Table Delivery",
      address: address || undefined,
      total,
      payment_method: payment_method || "Cash",
      payment_status: payment_status || "Pending",
      razorpay_order_id: razorpay_order_id || undefined,
      razorpay_payment_id: razorpay_payment_id || undefined,
      items: items.map((it) => ({
        item_name: it.item,
        price: it.price,
        qty: it.qty || 1
      }))
    });

    res.status(201).json({ success: true, order_no: order.order_no });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

module.exports = router;
