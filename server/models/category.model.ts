import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

// Category attributes interface
interface CategoryAttributes {
    id: number;
    title: string;
    description?: string;
    slug?: string;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

// Category creation attributes interface
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

// Category model class
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public slug!: string;
    public status!: 'active' | 'inactive';
    public createdAt!: Date;
    public updatedAt!: Date;
}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
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
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    hooks: {
        beforeCreate: (category: Category) => {
            // Generate slug from title if not provided
            if (!category.slug && category.title) {
                category.slug = category.title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')  // Remove special characters
                    .replace(/\s+/g, '-')     // Replace spaces with hyphens
                    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
            }
        },
        beforeUpdate: (category: Category) => {
            // Update slug when title changes
            if (category.changed('title') && category.title) {
                category.slug = category.title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
            }
        }
    }
});

export default Category;
