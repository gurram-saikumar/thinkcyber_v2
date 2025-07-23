"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// Topic model class
class Topic extends sequelize_1.Model {
}
exports.Topic = Topic;
// Initialize Topic model
Topic.init({
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
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    subcategoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    languageId: {
        type: sequelize_1.DataTypes.UUID,
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
    topicData: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('topicData');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('topicData', JSON.stringify(value));
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
    modelName: 'Topic',
    timestamps: true,
});
exports.default = Topic;
