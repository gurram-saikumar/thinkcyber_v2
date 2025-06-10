# LMS Database Schema Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tables](#tables)
   - [Users](#users)
   - [Courses](#courses)
   - [Orders](#orders)
   - [Notifications](#notifications)
   - [Layouts](#layouts)
3. [Relationships](#relationships)
4. [Indexes](#indexes)

## Overview
This document describes the database schema for the Learning Management System (LMS). The system uses MySQL with Sequelize ORM and includes five main tables with their relationships and constraints.

## Tables

### Users
Primary table for storing user information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, Auto Increment | Unique identifier |
| name | STRING | NOT NULL | User's full name |
| email | STRING | NOT NULL, UNIQUE | User's email address |
| password | STRING | NOT NULL | Hashed password |
| avatar | JSON | DEFAULT | Profile image info |
| role | STRING | DEFAULT 'user' | User role (user/admin) |
| isVerified | BOOLEAN | DEFAULT false | Email verification status |
| courses | JSON | DEFAULT [] | Enrolled courses |
| createdAt | DATE | NOT NULL | Record creation timestamp |
| updatedAt | DATE | NOT NULL | Record update timestamp |

### Courses
Stores course information and content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, Auto Increment | Unique identifier |
| name | STRING | NOT NULL | Course name |
| description | TEXT | NOT NULL | Course description |
| categories | STRING | NOT NULL | Course category |
| price | FLOAT | NOT NULL | Course price |
| estimatedPrice | FLOAT | NULL | Estimated price |
| thumbnail | JSON | DEFAULT | Course thumbnail |
| tags | STRING | NOT NULL | Course tags |
| level | STRING | NOT NULL | Course difficulty level |
| demoUrl | STRING | NOT NULL | Demo video URL |
| benefits | JSON | DEFAULT [] | Course benefits |
| prerequisites | JSON | DEFAULT [] | Course prerequisites |
| reviews | JSON | DEFAULT [] | Course reviews |
| courseData | JSON | DEFAULT [] | Course content |
| ratings | FLOAT | DEFAULT 0 | Average rating |
| purchased | INTEGER | DEFAULT 0 | Purchase count |
| userId | INTEGER | FK | Course creator ID |
| createdAt | DATE | NOT NULL | Record creation timestamp |
| updatedAt | DATE | NOT NULL | Record update timestamp |

### Orders
Tracks course purchases and payments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, Auto Increment | Unique identifier |
| courseId | INTEGER | FK, NOT NULL | Purchased course ID |
| userId | INTEGER | FK, NOT NULL | Buyer's user ID |
| payment_info | JSON | DEFAULT {} | Payment details |
| createdAt | DATE | NOT NULL | Record creation timestamp |
| updatedAt | DATE | NOT NULL | Record update timestamp |

### Notifications
Stores user notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, Auto Increment | Unique identifier |
| title | STRING | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification content |
| status | STRING | DEFAULT 'unread' | Notification status |
| userId | INTEGER | FK, NOT NULL | Recipient user ID |
| createdAt | DATE | NOT NULL | Record creation timestamp |
| updatedAt | DATE | NOT NULL | Record update timestamp |

### Layouts
Stores system layout configurations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, Auto Increment | Unique identifier |
| type | STRING | NOT NULL | Layout type |
| faq | JSON | DEFAULT [] | FAQ items |
| categories | JSON | DEFAULT [] | Category list |
| banner | JSON | DEFAULT | Banner configuration |
| createdAt | DATE | NOT NULL | Record creation timestamp |
| updatedAt | DATE | NOT NULL | Record update timestamp |

## Relationships

### One-to-Many Relationships
1. **User to Courses**
   - One user can create many courses
   - Foreign Key: `Courses.userId` references `Users.id`
   - Cascade: SET NULL on user deletion

2. **User to Orders**
   - One user can have many orders
   - Foreign Key: `Orders.userId` references `Users.id`
   - Cascade: CASCADE on user deletion

3. **User to Notifications**
   - One user can have many notifications
   - Foreign Key: `Notifications.userId` references `Users.id`
   - Cascade: CASCADE on user deletion

4. **Course to Orders**
   - One course can have many orders
   - Foreign Key: `Orders.courseId` references `Courses.id`
   - Cascade: CASCADE on course deletion

## Indexes

### Users Table
- Primary Key: `id`
- Unique Index: `email`

### Courses Table
- Primary Key: `id`
- Foreign Key Index: `userId`

### Orders Table
- Primary Key: `id`
- Foreign Key Indexes: `userId`, `courseId`

### Notifications Table
- Primary Key: `id`
- Foreign Key Index: `userId`
- Index: `status`

### Layouts Table
- Primary Key: `id`
- Index: `type`

## Data Types

### JSON Fields
1. **Users**
   - `avatar`: `{ public_id: string, url: string }`
   - `courses`: `Array<{ courseId: string }>`

2. **Courses**
   - `thumbnail`: `{ public_id: string, url: string }`
   - `benefits`: `Array<{ title: string }>`
   - `prerequisites`: `Array<{ title: string }>`
   - `reviews`: `Array<{ user: object, rating: number, comment: string, commentReplies: array }>`
   - `courseData`: `Array<{ videoUrl: string, videoThumbnail: object, title: string, videoSection: string, description: string, videoLength: number, videoPlayer: string, links: array, suggestion: string, questions: array }>`

3. **Orders**
   - `payment_info`: `{ /* payment details */ }`

4. **Notifications**
   - No complex JSON fields

5. **Layouts**
   - `faq`: `Array<{ question: string, answer: string }>`
   - `categories`: `Array<{ title: string }>`
   - `banner`: `{ image: { public_id: string, url: string }, title: string, subTitle: string }` 