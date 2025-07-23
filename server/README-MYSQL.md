# ThinkCyber Server

This is the backend server for ThinkCyber, a learning management system.

## Database Migration from MongoDB to MySQL

This project has been migrated from MongoDB to MySQL. Follow these steps to set up the database:

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Environment Setup

Create a `.env` file in the server directory with the following variables:

```
# Server Configuration
PORT=8000
NODE_ENV=development
ORIGIN=http://localhost:3000

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=thinkcyber_db
MYSQL_USER=root
MYSQL_PASSWORD=your_password

# JWT Configuration
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=5m
REFRESH_TOKEN_EXPIRE=3d

# Cloudinary Configuration
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE thinkcyber_db;
```

2. Run migrations to set up the database schema:

```bash
npm run db:migrate
```

3. To rollback migrations if needed:

```bash
npm run db:migrate:down
```

## Running the Server

1. Install dependencies:

```bash
npm install
```

2. For development:

```bash
npm run dev
```

3. For production:

```bash
npm run build
npm start
```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Project Structure

- `controllers/`: Request handlers
- `models/`: Sequelize models
- `routes/`: API routes
- `middleware/`: Custom middleware
- `utils/`: Utility functions
- `migrations/`: Database migration scripts
- `services/`: Business logic and services

## MySQL Models

The following models have been implemented using Sequelize:

- Users
- Categories
- Subcategories
- Languages
- Topics (formerly Courses)
- TopicContents
- Orders
- Notifications
- Layouts

## Running Migrations

The project uses custom migrations for creating and managing database tables:

```bash
# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:down
```
