import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../utils/database';

// SubCategory attributes interface
interface SubCategoryAttributes {
    id: number;
    title: string;
    categoryId: number;
    description: string;
    status: string;
}

// SubCategory creation attributes interface
interface SubCategoryCreationAttributes extends Optional<SubCategoryAttributes, 'id'> {}

// SubCategory model class
export class SubCategory extends Model<SubCategoryAttributes, SubCategoryCreationAttributes> implements SubCategoryAttributes {
    public id!: number;
    public title!: string;
    public categoryId!: number;
    public description!: string;
    public status!: string;
}

// Initialize SubCategory model
SubCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id',
            },
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
        modelName: 'SubCategory',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['title', 'categoryId'],
            },
        ],
    }
);

export default SubCategory;
