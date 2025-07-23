import { Category } from './sequelize/category.model';
import { SubCategory } from './sequelize/subcategory.model';
import { Language } from './sequelize/language.model';
import { Topic } from './topic.model';
import { User } from './user.model';

// Define relationships between models
export const setupRelationships = () => {
    // Category - SubCategory (one-to-many)
    Category.hasMany(SubCategory, {
        foreignKey: 'categoryId',
        as: 'subcategories',
        onDelete: 'CASCADE',
    });
    SubCategory.belongsTo(Category, {
        foreignKey: 'categoryId',
        as: 'category',
    });

    // Category - Topic (one-to-many)
    Category.hasMany(Topic, {
        foreignKey: 'categoryId',
        as: 'topics',
        onDelete: 'SET NULL',
    });
    Topic.belongsTo(Category, {
        foreignKey: 'categoryId',
        as: 'category',
    });

    // SubCategory - Topic (one-to-many)
    SubCategory.hasMany(Topic, {
        foreignKey: 'subcategoryId',
        as: 'topics',
        onDelete: 'SET NULL',
    });
    Topic.belongsTo(SubCategory, {
        foreignKey: 'subcategoryId',
        as: 'subcategory',
    });

    // Language - Topic (one-to-many)
    Language.hasMany(Topic, {
        foreignKey: 'languageId',
        as: 'topics',
        onDelete: 'SET NULL',
    });
    Topic.belongsTo(Language, {
        foreignKey: 'languageId',
        as: 'language',
    });

    // User - Topic (one-to-many)
    User.hasMany(Topic, {
        foreignKey: 'userId',
        as: 'topics',
        onDelete: 'CASCADE',
    });
    Topic.belongsTo(User, {
        foreignKey: 'userId',
        as: 'creator',
    });
};

export default setupRelationships;
