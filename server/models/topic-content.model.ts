import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

// TopicContent attributes interface
interface TopicContentAttributes {
    id: number;
    topicId: number;
    title: string;
    description?: string;
    videoUrl?: string;
    videoThumbnail?: string;
    videoSection?: string;
    videoLength?: number;
    videoPlayer?: string;
    links?: { title: string; url: string }[];
    suggestion?: string;
    questions?: { user: any; question: string; questionReplies: any[] }[];
    position: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// TopicContent creation attributes interface
interface TopicContentCreationAttributes extends Optional<TopicContentAttributes, 'id'> {}

// TopicContent model class
export class TopicContent extends Model<TopicContentAttributes, TopicContentCreationAttributes> implements TopicContentAttributes {
    public id!: number;
    public topicId!: number;
    public title!: string;
    public description!: string;
    public videoUrl!: string;
    public videoThumbnail!: string;
    public videoSection!: string;
    public videoLength!: number;
    public videoPlayer!: string;
    public links!: { title: string; url: string }[];
    public suggestion!: string;
    public questions!: { user: any; question: string; questionReplies: any[] }[];
    public position!: number;
    public isActive!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

TopicContent.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    topicId: {
        type: DataTypes.INTEGER, // Changed from UUID to INTEGER
        allowNull: false,
        references: {
            model: 'Topics', // Sequelize model name
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    videoThumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    videoSection: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    videoLength: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    videoPlayer: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'youtube',
    },
    links: {
        type: DataTypes.TEXT,
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
        type: DataTypes.TEXT,
        allowNull: true,
    },
    questions: {
        type: DataTypes.TEXT,
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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'TopicContent',
    tableName: 'topic_contents',
    timestamps: true,
});

export default TopicContent;
