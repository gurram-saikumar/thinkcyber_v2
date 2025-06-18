import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

interface FaqItem {
    question: string;
    answer: string;
}

interface Category {
    title: string;
    _id?: string;
}

interface SubCategory {
    title: string;
    categoryId: string;
    _id?: string;
}

interface BannerImage {
    public_id: string;
    url: string;
}

interface LayoutAttributes {
    id: number;
    type: string;
    faq: FaqItem[];
    categories: Category[];
    subcategories: SubCategory[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

interface LayoutCreationAttributes extends Optional<LayoutAttributes, 'id'> {}

class Layout extends Model<LayoutAttributes, LayoutCreationAttributes> implements LayoutAttributes {
    public id!: number;
    public type!: string;
    public faq!: FaqItem[];
    public categories!: Category[];
    public subcategories!: SubCategory[];
    public banner!: {
        image: BannerImage;
        title: string;
        subTitle: string;
    };
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Layout.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        faq: {
            type: DataTypes.TEXT,
            defaultValue: '[]',
            get() {
                const value = this.getDataValue('faq');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('faq', JSON.stringify(value));
            }
        },
        categories: {
            type: DataTypes.TEXT,
            defaultValue: '[]',
            get() {
                const value = this.getDataValue('categories');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('categories', JSON.stringify(value));
            }
        },
        subcategories: {
            type: DataTypes.TEXT,
            defaultValue: '[]',
            get() {
                const value = this.getDataValue('subcategories');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('subcategories', JSON.stringify(value));
            }
        },
        banner: {
            type: DataTypes.TEXT,
            defaultValue: JSON.stringify({
                image: { public_id: "", url: "" },
                title: "",
                subTitle: ""
            }),
            get() {
                const value = this.getDataValue('banner');
                return value ? JSON.parse(value) : null;
            },
            set(value) {
                this.setDataValue('banner', JSON.stringify(value));
            }
        }
    },
    {
        sequelize,
        modelName: 'Layout',
    }
);

export default Layout;