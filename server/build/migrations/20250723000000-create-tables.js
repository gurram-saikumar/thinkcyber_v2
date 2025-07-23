"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
// Migration function to create all tables
async function up() {
    const queryInterface = database_1.sequelize.getQueryInterface();
    // Create Users table
    await queryInterface.createTable('users', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        isVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        },
        enrolledCourses: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Categories table
    await queryInterface.createTable('categories', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Subcategories table
    await queryInterface.createTable('subcategories', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        categoryId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Languages table
    await queryInterface.createTable('languages', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        code: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
            unique: true
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Topics table (replacing Courses)
    await queryInterface.createTable('topics', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        estimatedPrice: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true
        },
        thumbnail: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        tags: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        level: {
            type: sequelize_1.DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
            allowNull: false
        },
        demoUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        benefits: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        prerequisites: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        categoryId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        subcategoryId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: 'subcategories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        languageId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: 'languages',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        instructions: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        sold: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        ratings: {
            type: sequelize_1.DataTypes.FLOAT,
            defaultValue: 0
        },
        purchased: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        reviews: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Topic Contents table
    await queryInterface.createTable('topic_contents', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        topicId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topics',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        videoUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        videoThumbnail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        videoSection: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        videoLength: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        },
        videoPlayer: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'youtube'
        },
        links: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        suggestion: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        questions: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        position: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Orders table
    await queryInterface.createTable('orders', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        topicId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topics',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        payment_info: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('created', 'paid', 'delivered', 'cancelled'),
            defaultValue: 'created'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Notifications table
    await queryInterface.createTable('notifications', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('unread', 'read'),
            defaultValue: 'unread'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    // Create Layouts table
    await queryInterface.createTable('layouts', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        data: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
    console.log('Migration: Tables created successfully');
}
exports.up = up;
// Migration function to drop all tables
async function down() {
    const queryInterface = database_1.sequelize.getQueryInterface();
    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('topic_contents');
    await queryInterface.dropTable('topics');
    await queryInterface.dropTable('languages');
    await queryInterface.dropTable('subcategories');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('layouts');
    console.log('Migration: Tables dropped successfully');
}
exports.down = down;
