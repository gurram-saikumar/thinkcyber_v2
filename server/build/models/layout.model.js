"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
class Layout extends sequelize_1.Model {
}
Layout.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    faq: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('faq');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('faq', JSON.stringify(value));
        }
    },
    categories: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('categories');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('categories', JSON.stringify(value));
        }
    },
    subcategories: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('subcategories');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('subcategories', JSON.stringify(value));
        }
    },
    banner: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: JSON.stringify({
            image: { public_id: "", url: "" },
            title: "",
            subTitle: ""
        }),
        get() {
            const value = this.getDataValue('banner');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('banner', JSON.stringify(value));
        }
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Layout',
});
exports.default = Layout;
