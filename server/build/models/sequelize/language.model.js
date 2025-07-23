"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// Language model class
class Language extends sequelize_1.Model {
}
exports.Language = Language;
// Initialize Language model
Language.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    code: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 5],
        },
    },
    isDefault: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Language',
    timestamps: true,
    hooks: {
        beforeCreate: async (language) => {
            // If this is set as default, unset all other defaults
            if (language.isDefault) {
                await Language.update({ isDefault: false }, { where: {} });
            }
        },
        beforeUpdate: async (language) => {
            // If this is set as default, unset all other defaults
            if (language.isDefault) {
                await Language.update({ isDefault: false }, { where: { id: { [database_1.sequelize.Sequelize.Op.ne]: language.id } } });
            }
        },
    },
});
exports.default = Language;
