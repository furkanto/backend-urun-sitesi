const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlandı"))
  .catch(err => console.log(err));

// Ürün şeması
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  sizes: [String],
  images: [String],
  category: String,
});

const Product = mongoose.model("Product", ProductSchema);

// ⇩ Basit admin giriş (şifresi .env’den gelecek)
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Bilgiler yanlış" });
});

// Ürün ekleme
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Tüm ürünleri çekme
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Tek ürün
app.get("/api/products/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  res.json(p);
});

// Sunucu
app.listen(5000, () => console.log("Backend çalışıyor (5000)"));
