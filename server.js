const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- MONGODB BAĞLANTISI --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlandı"))
  .catch(err => console.log(err));


// -------------------- ÜRÜN MODELİ --------------------
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  sizes: [String],
  images: [String],
  category: String,
});
const Product = mongoose.model("Product", ProductSchema);


// -------------------- BANNER MODELİ --------------------
const BannerSchema = new mongoose.Schema({
  slider1: String,
  slider2: String,
  slider3: String,
  women: String,
  men: String,
  kids: String
});
const Banner = mongoose.model("Banner", BannerSchema);


// -------------------- DOSYA UPLOAD AYARI --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });


// -------------------- ADMIN GİRİŞ --------------------
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


// -------------------- ÜRÜN İŞLEMLERİ --------------------
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  res.json(p);
});


// -------------------- BANNER GET --------------------
app.get("/api/banners", async (req, res) => {
  let banner = await Banner.findOne();

  if (!banner) {
    banner = new Banner({
      slider1: "",
      slider2: "",
      slider3: "",
      women: "",
      men: "",
      kids: ""
    });
    await banner.save();
  }

  res.json(banner);
});


// -------------------- BANNER UPDATE (UPLOAD + VERİ KAYIT) --------------------
app.post("/api/banners/update", upload.single("banner"), async (req, res) => {
  const field = req.body.field; // slid
