import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Define essential tables and their relationships
export async function setupModels(sequelize: Sequelize) {
    // Users Model
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        enrolledCourses: {
            type: DataTypes.JSON,
            defaultValue: null
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    // Languages Model
    const Language = sequelize.define('Language', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        slug: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
    }, {
        tableName: 'languages',
        timestamps: true
    });

    // Categories Model
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        },
        slug: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
    }, {
        tableName: 'categories',
        timestamps: true
    });

    // SubCategories Model
    const SubCategory = sequelize.define('SubCategory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        slug: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
    }, {
        tableName: 'subcategories',
        timestamps: true
    });

    // Topics Model (equivalent to courses)
    const Topic = sequelize.define('Topic', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estimatedPrice: {
            type: DataTypes.DECIMAL(10, 2)
        },
        thumbnail: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        tags: {
            type: DataTypes.STRING
        },
        level: {
            type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: false
        },
        demoUrl: {
            type: DataTypes.STRING
        },
        benefits: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        prerequisites: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        sold: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('draft', 'published'),
            defaultValue: 'draft'
        },
        reviews: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        ratings: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.00
        }
    }, {
        tableName: 'topics',
        timestamps: true
    });

    // Topic Contents Model
    const TopicContent = sequelize.define('TopicContent', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        videoSection: {
            type: DataTypes.STRING
        },
        links: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        suggestion: {
            type: DataTypes.TEXT
        },
        questions: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'topic_contents',
        timestamps: true
    });

    // Orders Model
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        payment_info: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM('created', 'paid', 'delivered', 'cancelled'),
            defaultValue: 'created'
        }
    }, {
        tableName: 'orders',
        timestamps: true
    });

    // Define relationships
    Category.hasMany(SubCategory, { foreignKey: 'categoryId' });
    SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });

    User.hasMany(Topic, { foreignKey: 'userId' });
    Topic.belongsTo(User, { foreignKey: 'userId' });

    Category.hasMany(Topic, { foreignKey: 'categoryId' });
    Topic.belongsTo(Category, { foreignKey: 'categoryId' });

    SubCategory.hasMany(Topic, { foreignKey: 'subcategoryId' });
    Topic.belongsTo(SubCategory, { foreignKey: 'subcategoryId' });

    Language.hasMany(Topic, { foreignKey: 'languageId' });
    Topic.belongsTo(Language, { foreignKey: 'languageId' });

    Topic.hasMany(TopicContent, { foreignKey: 'topicId' });
    TopicContent.belongsTo(Topic, { foreignKey: 'topicId' });

    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });

    Topic.hasMany(Order, { foreignKey: 'topicId' });
    Order.belongsTo(Topic, { foreignKey: 'topicId' });

    return {
        User,
        Language,
        Category,
        SubCategory,
        Topic,
        TopicContent,
        Order
    };
}
