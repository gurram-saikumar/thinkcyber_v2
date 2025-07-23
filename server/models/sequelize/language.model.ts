import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../utils/database';

// Language attributes interface
interface LanguageAttributes {
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    status: string;
}

// Language creation attributes interface
interface LanguageCreationAttributes extends Optional<LanguageAttributes, 'id' | 'isDefault'> {}

// Language model class
export class Language extends Model<LanguageAttributes, LanguageCreationAttributes> implements LanguageAttributes {
    public id!: string;
    public name!: string;
    public code!: string;
    public isDefault!: boolean;
    public status!: string;
}

// Initialize Language model
Language.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        code: {
            type: DataTypes.STRING(5),
            allowNull: false,
            unique: true,
            validate: {
                len: [2, 5],
            },
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        modelName: 'Language',
        timestamps: true,
        hooks: {
            beforeCreate: async (language) => {
                // If this is set as default, unset all other defaults
                if (language.isDefault) {
                    await Language.update({ isDefault: false }, { where: {} });
                }
            },
            beforeUpdate: async (language) => {
                // If this is set as default, unset all other defaults
                if (language.isDefault) {
                    await Language.update(
                        { isDefault: false },
                        { where: { id: { [sequelize.Sequelize.Op.ne]: language.id } } }
                    );
                }
            },
        },
    }
);

export default Language;
