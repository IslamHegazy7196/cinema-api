const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "please provide movie name"],
      maxlength: [100, "name cannot be more than 100 character"],
    },
    releaseDate: {
      type: Date,
      required: [true, "please provide movie release date"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
  },
  { timestamps: true }
);

moviesSchema.index({ name: "text" });

module.exports = mongoose.model("Movies", moviesSchema);
