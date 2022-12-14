const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Favorite = new Schema(
  {
    userId: { type: String, require: true },
    movieId: { type: Schema.Types.ObjectId, ref: "movies", require: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("favorites", Favorite);
