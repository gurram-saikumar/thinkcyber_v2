import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';

// Migration function to create all tables
export async function up() {
    const queryInterface = sequelize.getQueryInterface();

    // Create Users table
    await queryInterface.createTable('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
            type: DataTypes.TEXT,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        enrolledCourses: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Categories table
    await queryInterface.createTable('categories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Subcategories table
    await queryInterface.createTable('subcategories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Languages table
    await queryInterface.createTable('languages', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        code: {
            type: DataTypes.STRING(5),
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Topics table (replacing Courses)
    await queryInterface.createTable('topics', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        estimatedPrice: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        thumbnail: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tags: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        level: {
            type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
            allowNull: false
        },
        demoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        benefits: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        prerequisites: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        subcategoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'subcategories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        languageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'languages',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sold: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        ratings: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        purchased: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        reviews: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Topic Contents table
    await queryInterface.createTable('topic_contents', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topics',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        videoThumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        videoSection: {
            type: DataTypes.STRING,
            allowNull: true
        },
        videoLength: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        videoPlayer: {
            type: DataTypes.STRING,
            defaultValue: 'youtube'
        },
        links: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        suggestion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        questions: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Orders table
    await queryInterface.createTable('orders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topics',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        payment_info: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('created', 'paid', 'delivered', 'cancelled'),
            defaultValue: 'created'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Notifications table
    await queryInterface.createTable('notifications', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('unread', 'read'),
            defaultValue: 'unread'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // Create Layouts table
    await queryInterface.createTable('layouts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    console.log('Migration: Tables created successfully');
}

// Migration function to drop all tables
export async function down() {
    const queryInterface = sequelize.getQueryInterface();

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
