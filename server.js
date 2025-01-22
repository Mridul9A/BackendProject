const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const redis = require('redis');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/ swagger.json');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate environment variables
if (!process.env.MONGO_URI || !process.env.REDIS_URI || !process.env.GOOGLE_CLIENT_ID) {
  console.error('Missing required environment variables. Check your .env file.');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

// Connect to Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});
redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(err => {
    console.error('Redis connection error:', err);
    process.exit(1); 
  });

// Routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/shorten', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
