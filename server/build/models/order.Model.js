"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
const user_model_1 = require("./user.model");
const course_model_1 = require("./course.model");
// Order model class
class Order extends sequelize_1.Model {
}
exports.Order = Order;
// Initialize Order model
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    courseId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    payment_info: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue('payment_info');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('payment_info', JSON.stringify(value));
        }
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Order',
    timestamps: true,
});
// Define associations
Order.belongsTo(user_model_1.User, { foreignKey: 'userId' });
Order.belongsTo(course_model_1.Course, { foreignKey: 'courseId' });
