"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicContent = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// TopicContent model class
class TopicContent extends sequelize_1.Model {
}
exports.TopicContent = TopicContent;
TopicContent.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    topicId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'topics',
            key: 'id'
        }
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    videoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    videoThumbnail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    videoSection: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    videoLength: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    videoPlayer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'youtube',
    },
    links: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('links');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('links', JSON.stringify(value));
        }
    },
    suggestion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    questions: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('questions');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('questions', JSON.stringify(value));
        }
    },
    position: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'TopicContent',
    tableName: 'topic_contents',
    timestamps: true,
});
exports.default = TopicContent;
