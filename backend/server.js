const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Node to use Google Public DNS

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const loomRoutes = require('./routes/loomRoutes');
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// CORS Configuration (Configured specifically for Vite frontend)
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/looms', loomRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

// Base Health Check Route
app.get('/', (req, res) => {
  res.send('Loom Management API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});