import { sequelize } from '../utils/database';
import { User } from './user.model';
import Topic from './topic.model';
import { Order } from './order.model';
import { Notification } from './notification.model';
import { Layout } from './layout.model';

// Initialize models
const models = {
    User,
    Topic,
    Order,
    Notification,
    Layout
};

// Define associations
User.hasMany(Topic, { foreignKey: 'userId', as: 'createdTopics' });
Topic.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Topic.hasMany(Order, { foreignKey: 'topicId', as: 'orders' });
Order.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

// Export models and sequelize instance
export {
    sequelize,
    User,
    Topic,
    Order,
    Notification,
    Layout
}; 