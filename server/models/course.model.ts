import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

// Course attributes interface
interface CourseAttributes {
    id: string;
    userId: string;
    name: string;
    description: string;
    categories: string;
    subcategories: string;
    price: number;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: Array<{ title: string }>;
    prerequisites: Array<{ title: string }>;
    reviews: Array<{
        userId: string;
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
    courseData: Array<{
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

// Course creation attributes interface
interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'ratings' | 'purchased'> {}

// Course model class
export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
    public id!: string;
    public userId!: string;
    public name!: string;
    public description!: string;
    public categories!: string;
    public subcategories!: string;
    public price!: number;
    public thumbnail!: {
        public_id: string;
        url: string;
    };
    public tags!: string;
    public level!: string;
    public demoUrl!: string;
    public benefits!: Array<{ title: string }>;
    public prerequisites!: Array<{ title: string }>;
    public reviews!: Array<{
        userId: string;
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
    public courseData!: Array<{
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

// Initialize Course model
Course.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
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
        categories: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subcategories: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
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
        courseData: {
            type: DataTypes.TEXT,
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
        modelName: 'Course',
        timestamps: true,
    }
);
