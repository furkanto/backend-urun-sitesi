const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    slider1: String,
    slider2: String,
    slider3: String,
    women: String,
    men: String,
    kids: String
});

module.exports = mongoose.model("Banner", BannerSchema);
