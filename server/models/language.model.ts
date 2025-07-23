import mongoose from "mongoose";

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter language name"],
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Please enter language code"],
      unique: true,
      minlength: [2, "Language code should be at least 2 characters"],
      maxlength: [5, "Language code should not exceed 5 characters"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Language = mongoose.models.Language || mongoose.model("Language", languageSchema);

export default Language;
