"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// Course model class
class Course extends sequelize_1.Model {
}
exports.Course = Course;
// Initialize Course model
Course.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    categories: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subcategories: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estimatedPrice: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    thumbnail: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('thumbnail');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('thumbnail', JSON.stringify(value));
        }
    },
    tags: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    demoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    benefits: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('benefits');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('benefits', JSON.stringify(value));
        }
    },
    prerequisites: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('prerequisites');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('prerequisites', JSON.stringify(value));
        }
    },
    reviews: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('reviews');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('reviews', JSON.stringify(value));
        }
    },
    courseData: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('courseData');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('courseData', JSON.stringify(value));
        }
    },
    ratings: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    purchased: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Course',
    timestamps: true,
});
