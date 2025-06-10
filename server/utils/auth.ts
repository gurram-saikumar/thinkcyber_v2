import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

// Validate email format
export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(enteredPassword, hashedPassword);
};

// Create activation token
export const createActivationToken = (user: User): { token: string; activationCode: string } => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    const token = jwt.sign(
        { 
            user,
            activationCode 
        },
        process.env.ACTIVATION_SECRET as Secret,
        { expiresIn: '5m' }
    );

    return { token, activationCode };
};

// Generate access token
export const generateAccessToken = (user: User): string => {
    return jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: '5m' }
    );
};

// Generate refresh token
export const generateRefreshToken = (user: User): string => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: '7d' }
    );
}; 