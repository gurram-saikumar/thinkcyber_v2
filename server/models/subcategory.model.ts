import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter subcategory title"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a parent category"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique subcategories within a category
subcategorySchema.index({ title: 1, categoryId: 1 }, { unique: true });

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subcategorySchema);

export default SubCategory;
