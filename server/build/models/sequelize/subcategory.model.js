"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// SubCategory model class
class SubCategory extends sequelize_1.Model {
}
exports.SubCategory = SubCategory;
// Initialize SubCategory model
SubCategory.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id',
        },
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
    modelName: 'SubCategory',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['title', 'categoryId'],
        },
    ],
});
exports.default = SubCategory;
