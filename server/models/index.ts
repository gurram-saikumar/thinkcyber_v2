import { sequelize } from '../utils/database';
import { User } from './user.model';
import { Course } from './course.model';
import { Order } from './order.model';
import { Notification } from './notification.model';
import { Layout } from './layout.model';

// Initialize models
const models = {
    User,
    Course,
    Order,
    Notification,
    Layout
};

// Define associations
User.hasMany(Course, { foreignKey: 'userId', as: 'createdCourses' });
Course.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Order, { foreignKey: 'courseId', as: 'orders' });
Order.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Export models and sequelize instance
export {
    sequelize,
    User,
    Course,
    Order,
    Notification,
    Layout
}; 