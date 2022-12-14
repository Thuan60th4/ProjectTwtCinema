const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const Movies = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    trailerCode: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    backdrop_path: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    genres: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
    },
    ibmPoints: {
      type: Number,
    },
    country: {
      type: String,
    },
    overview: {
      type: String,
      required: true,
    },
    seasons: {
      type: Number,
      required: false,
    },
    episodes: {
      type: Number,
      required: false,
    },
    viewed: { type: Number, required: false, default: 0 },

    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

Movies.index({ name: "text" });

module.exports = mongoose.model("movies", Movies);
