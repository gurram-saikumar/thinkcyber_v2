import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { User } from './user.model';
import Topic from './topic.model';

// Order attributes interface
interface OrderAttributes {
    id: number;
    userId: number;
    topicId: number;
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
    public id!: number;
    public userId!: number;
    public topicId!: number;
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
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_info: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const value = this.getDataValue('payment_info');
                return value ? JSON.parse(value) : { id: '', status: '', type: '' };
            },
            set(value: { id: string; status: string; type: string }) {
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
Order.belongsTo(Topic, { foreignKey: 'topicId' });