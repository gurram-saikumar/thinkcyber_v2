"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const languageSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const Language = mongoose_1.default.models.Language || mongoose_1.default.model("Language", languageSchema);
exports.default = Language;
