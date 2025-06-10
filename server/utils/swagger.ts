import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LMS API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Learning Management System',
        },
        servers: [
            {
                url: process.env.SERVER_URL || 'http://localhost:8000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        avatar: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Course: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        thumbnail: { type: 'string' },
                        categories: { type: 'array', items: { type: 'string' } },
                        level: { type: 'string' },
                        demoUrl: { type: 'string' },
                        benefits: { type: 'array', items: { type: 'string' } },
                        prerequisites: { type: 'array', items: { type: 'string' } },
                        reviews: { type: 'array', items: { type: 'object' } },
                        courseData: { type: 'array', items: { type: 'object' } },
                        ratings: { type: 'number' },
                        purchased: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        courseId: { type: 'integer' },
                        userId: { type: 'integer' },
                        payment_info: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: [
        './routes/*.ts',
        './controllers/*.ts',
        './models/*.ts'
    ], // Path to the API routes and documentation
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi }; 