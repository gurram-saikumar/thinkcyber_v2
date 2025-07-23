import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../utils/database';

// Category attributes interface
interface CategoryAttributes {
    id: number;
    title: string;
    description: string;
    status: string;
}

// Category creation attributes interface
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

// Category model class
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: string;
}

// Initialize Category model
Category.init(
    {
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
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        modelName: 'Category',
        timestamps: true,
    }
);

export default Category;
