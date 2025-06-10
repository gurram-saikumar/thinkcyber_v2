import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User attributes interface
interface UserAttributes {
    id: string;
  name: string;
  email: string;
  password: string;
    avatar?: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
    enrolledCourses: Array<{ courseId: string }>;
}

// User creation attributes interface
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'isVerified' | 'enrolledCourses'> {}

// User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public avatar!: {
        public_id: string;
        url: string;
    };
    public role!: string;
    public isVerified!: boolean;
    public enrolledCourses!: Array<{ courseId: string }>;

    // Method to compare password
    public async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    public SignAccessToken(): string {
        return jwt.sign({ id: this.id }, process.env.ACCESS_TOKEN || "", {
            expiresIn: "5m",
        });
    }

    public SignRefreshToken(): string {
        return jwt.sign({ id: this.id }, process.env.REFRESH_TOKEN || "", {
            expiresIn: "3d",
        });
    }
}

// Initialize User model
User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    name: {
            type: DataTypes.STRING,
            allowNull: false,
    },
    email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
      validate: {
                isEmail: true,
            },
    },
    password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100],
            },
    },
    avatar: {
            type: DataTypes.TEXT,
            defaultValue: JSON.stringify({
                public_id: '',
                url: '',
            }),
            get() {
                const value = this.getDataValue('avatar');
                return value ? JSON.parse(value) : null;
            },
            set(value) {
                this.setDataValue('avatar', JSON.stringify(value));
            }
    },
    role: {
            type: DataTypes.STRING,
            defaultValue: 'user',
    },
    isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
    },
        enrolledCourses: {
            type: DataTypes.TEXT,
            defaultValue: '[]',
            get() {
                const value = this.getDataValue('enrolledCourses');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('enrolledCourses', JSON.stringify(value));
            }
        },
  },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
    }
);

// Hash password before saving
User.beforeCreate(async (user: User) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Hash password before updating
User.beforeUpdate(async (user: User) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

export default User;
