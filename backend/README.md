# Expense Tracker Backend API

A RESTful API backend for the Expense Tracker application built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 User authentication with JWT
- 💰 Full CRUD operations for expenses
- 📊 Expense statistics and analytics
- 🛡️ Input validation and sanitization
- 🚀 Rate limiting and security headers
- 📝 Comprehensive error handling
- 🔍 Filtering and pagination

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd expense-tracker-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

### Expense Endpoints

All expense endpoints require authentication (Bearer token in Authorization header).

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer <your-jwt-token>

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 100)
- category: Filter by category
- startDate: Filter from date (YYYY-MM-DD)
- endDate: Filter to date (YYYY-MM-DD)
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "description": "Lunch at restaurant",
  "amount": 25.50,
  "category": "food",
  "date": "2024-01-15"
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "description": "Updated description",
  "amount": 30.00,
  "category": "food",
  "date": "2024-01-15"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <your-jwt-token>
```

#### Get Expense Statistics
```http
GET /api/expenses/stats
Authorization: Bearer <your-jwt-token>

Query Parameters:
- year: Year for statistics (default: current year)
- month: Month for statistics (1-12, optional)
```

### Categories

Valid expense categories:
- `food` - Food & Dining
- `transport` - Transportation
- `entertainment` - Entertainment
- `shopping` - Shopping
- `utilities` - Utilities
- `health` - Health & Medical
- `other` - Other

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt with salt rounds
- **Rate Limiting:** Prevents API abuse
- **CORS:** Configurable cross-origin requests
- **Helmet:** Security headers
- **Input Validation:** Comprehensive request validation
- **Error Handling:** Secure error responses

## Database Schema

### User Schema
```javascript
{
  name: String (required, max: 50)
  email: String (required, unique, valid email)
  password: String (required, min: 6, hashed)
  timestamps: true
}
```

### Expense Schema
```javascript
{
  user: ObjectId (required, ref: User)
  description: String (required, max: 200)
  amount: Number (required, min: 0.01)
  category: String (required, enum: categories)
  date: Date (required, default: now)
  timestamps: true
}
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your-super-secure-production-secret
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Heroku Deployment
```bash
# Install Heroku CLI
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.