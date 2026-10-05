require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const Product = require("./models/product");
const Order = require("./models/Order")
const sendOrderEmails = require("./email");

const app = express();
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Brew Haven Coffee API is running!"
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({
      available: true
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
});
app.post("/api/orders", async (req, res) => {
  try {
const body = req.body || {};

const customer = body.customer || {};
const items = body.items || [];
const paymentMethod = body.paymentMethod || "cod";

console.log("========== ORDER DEBUG ==========");
console.log("Request body:", JSON.stringify(body, null, 2));
console.log("Customer:", JSON.stringify(customer, null, 2));
console.log("Name:", customer.name);
console.log("Phone:", customer.phone);
console.log("Email:", customer.email);
console.log("Address:", customer.address);
console.log("Items:", JSON.stringify(items, null, 2));
console.log("=================================");

// Basic validation
if (
  String(customer.name || "").trim() === "" ||
  String(customer.phone || "").trim() === "" ||
  String(customer.email || "").trim() === "" ||
  String(customer.address || "").trim() === ""
) {
  return res.status(400).json({
    success: false,
    message: "Customer details are required"
  });
}

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item"
      });
    }

    // Get product IDs from the customer's cart
    const productIds = items.map(item => item.productId);

    // Get REAL products and prices from MongoDB
    const products = await Product.find({
      _id: { $in: productIds },
      available: true
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are unavailable"
      });
    }

    // Build order items using database prices
    const orderItems = items.map(cartItem => {
      const product = products.find(
        p => p._id.toString() === cartItem.productId
      );

      const quantity = Number(cartItem.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid quantity");
      }

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity
      };
    });

    // Calculate subtotal on SERVER
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending"
    });
   try {
  await sendOrderEmails(order);

  console.log("Order emails sent successfully!");

} catch (emailError) {
  console.error("Email sending failed:", emailError.message);
}

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });

  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});