"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// User model class
class User extends sequelize_1.Model {
    // Method to compare password
    async comparePassword(password) {
        return await bcryptjs_1.default.compare(password, this.password);
    }
    SignAccessToken() {
        return jsonwebtoken_1.default.sign({ id: this.id }, process.env.ACCESS_TOKEN || "", {
            expiresIn: "5m",
        });
    }
    SignRefreshToken() {
        return jsonwebtoken_1.default.sign({ id: this.id }, process.env.REFRESH_TOKEN || "", {
            expiresIn: "3d",
        });
    }
}
exports.User = User;
// Initialize User model
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100],
        },
    },
    avatar: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: JSON.stringify({
            public_id: '',
            url: '',
        }),
        get() {
            const value = this.getDataValue('avatar');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('avatar', JSON.stringify(value));
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'user',
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    enrolledCourses: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('enrolledCourses');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('enrolledCourses', JSON.stringify(value));
        }
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'User',
    timestamps: true,
});
// Hash password before saving
User.beforeCreate(async (user) => {
    if (user.password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(user.password, salt);
    }
});
// Hash password before updating
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(user.password, salt);
    }
});
exports.default = User;
