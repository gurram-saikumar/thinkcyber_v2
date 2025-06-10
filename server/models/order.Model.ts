import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { User } from './user.model';
import { Course } from './course.model';

// Order attributes interface
interface OrderAttributes {
    id: string;
    userId: string;
    courseId: string;
    payment_info: {
        id: string;
        status: string;
        type: string;
    };
}

// Order creation attributes interface
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

// Order model class
export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: string;
    public userId!: string;
    public courseId!: string;
    public payment_info!: {
        id: string;
        status: string;
        type: string;
    };
}

// Initialize Order model
Order.init(
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
        courseId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        payment_info: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const value = this.getDataValue('payment_info');
                return value ? JSON.parse(value) : null;
            },
            set(value) {
                this.setDataValue('payment_info', JSON.stringify(value));
            }
        },
    },
    {
        sequelize,
        modelName: 'Order',
        timestamps: true,
    }
);

// Define associations
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Course, { foreignKey: 'courseId' });