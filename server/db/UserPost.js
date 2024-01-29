const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
    text: String,
    image: String,
    userId: String,
  });

module.exports = mongoose.model("UserPost", userPostSchema);
