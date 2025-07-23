import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

// Topic attributes interface
interface TopicAttributes {
    id: number;
    userId: number;
    name: string;
    description: string;
    categoryId: number;
    subcategoryId: number;
    languageId: string;
    price: number;
    estimatedPrice: string;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: Array<{ title: string }>;
    prerequisites: Array<{ title: string }>;
    status: 'draft' | 'published';
    reviews: Array<{
        userId: number;
        rating: number;
        comment: string;
        user: {
            name: string;
            avatar: {
                url: string;
            };
        };
        commentReplies: Array<any>;
    }>;
    topicData: Array<{
        title: string;
        description: string;
        videoUrl: string;
        videoSection: string;
        links: Array<{
            title: string;
            url: string;
        }>;
        suggestion: string;
        questions: Array<{
            user: any;
            question: string;
            questionReplies: Array<any>;
        }>;
    }>;
    ratings: number;
    purchased: number;
}

// Topic creation attributes interface
interface TopicCreationAttributes extends Optional<TopicAttributes, 'id' | 'ratings' | 'purchased'> {}

// Topic model class
export class Topic extends Model<TopicAttributes, TopicCreationAttributes> implements TopicAttributes {
    public id!: number;
    public userId!: number;
    public name!: string;
    public description!: string;
    public categoryId!: number;
    public subcategoryId!: number;
    public languageId!: string;
    public price!: number;
    public estimatedPrice!: string;
    public thumbnail!: {
        public_id: string;
        url: string;
    };
    public tags!: string;
    public level!: string;
    public demoUrl!: string;
    public benefits!: Array<{ title: string }>;
    public prerequisites!: Array<{ title: string }>;
    public status!: 'draft' | 'published';
    public reviews!: Array<{
        userId: number;
        rating: number;
        comment: string;
        user: {
            name: string;
            avatar: {
                url: string;
            };
        };
        commentReplies: Array<any>;
    }>;
    public topicData!: Array<{
        title: string;
        description: string;
        videoUrl: string;
        videoSection: string;
        links: Array<{
            title: string;
            url: string;
        }>;
        suggestion: string;
        questions: Array<{
            user: any;
            question: string;
            questionReplies: Array<any>;
        }>;
    }>;
    public ratings!: number;
    public purchased!: number;
}

// Initialize Topic model
Topic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subcategoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        languageId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        estimatedPrice: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thumbnail: {
            type: DataTypes.TEXT,
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        demoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        benefits: {
            type: DataTypes.TEXT,
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
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const value = this.getDataValue('prerequisites');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('prerequisites', JSON.stringify(value));
            }
        },
        status: {
            type: DataTypes.ENUM('draft', 'published'),
            defaultValue: 'draft',
            allowNull: false,
        },
        reviews: {
            type: DataTypes.TEXT,
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
            type: DataTypes.TEXT,
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
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        purchased: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Topic',
        timestamps: true,
    }
);

export default Topic;
