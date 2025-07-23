"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRelationships = void 0;
const category_model_1 = require("./sequelize/category.model");
const subcategory_model_1 = require("./sequelize/subcategory.model");
const language_model_1 = require("./sequelize/language.model");
const topic_model_1 = require("./topic.model");
const user_model_1 = require("./user.model");
// Define relationships between models
const setupRelationships = () => {
    // Category - SubCategory (one-to-many)
    category_model_1.Category.hasMany(subcategory_model_1.SubCategory, {
        foreignKey: 'categoryId',
        as: 'subcategories',
        onDelete: 'CASCADE',
    });
    subcategory_model_1.SubCategory.belongsTo(category_model_1.Category, {
        foreignKey: 'categoryId',
        as: 'category',
    });
    // Category - Topic (one-to-many)
    category_model_1.Category.hasMany(topic_model_1.Topic, {
        foreignKey: 'categoryId',
        as: 'topics',
        onDelete: 'SET NULL',
    });
    topic_model_1.Topic.belongsTo(category_model_1.Category, {
        foreignKey: 'categoryId',
        as: 'category',
    });
    // SubCategory - Topic (one-to-many)
    subcategory_model_1.SubCategory.hasMany(topic_model_1.Topic, {
        foreignKey: 'subcategoryId',
        as: 'topics',
        onDelete: 'SET NULL',
    });
    topic_model_1.Topic.belongsTo(subcategory_model_1.SubCategory, {
        foreignKey: 'subcategoryId',
        as: 'subcategory',
    });
    // Language - Topic (one-to-many)
    language_model_1.Language.hasMany(topic_model_1.Topic, {
        foreignKey: 'languageId',
        as: 'topics',
        onDelete: 'SET NULL',
    });
    topic_model_1.Topic.belongsTo(language_model_1.Language, {
        foreignKey: 'languageId',
        as: 'language',
    });
    // User - Topic (one-to-many)
    user_model_1.User.hasMany(topic_model_1.Topic, {
        foreignKey: 'userId',
        as: 'topics',
        onDelete: 'CASCADE',
    });
    topic_model_1.Topic.belongsTo(user_model_1.User, {
        foreignKey: 'userId',
        as: 'creator',
    });
};
exports.setupRelationships = setupRelationships;
exports.default = exports.setupRelationships;
