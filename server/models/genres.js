const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Genres = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("genres", Genres);
