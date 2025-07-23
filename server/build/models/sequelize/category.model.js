"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// Category model class
class Category extends sequelize_1.Model {
}
exports.Category = Category;
// Initialize Category model
Category.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Category',
    timestamps: true,
});
exports.default = Category;
