import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import projectRoutes from './routes/projects.js';
import reviewRoutes from './routes/reviews.js';
import contactRoutes from './routes/contacts.js';
import quoteRoutes from './routes/quotes.js';
import settingsRoutes from './routes/settings.js';
import teamRoutes from './routes/team.js';

// Configure dotenv - Only for local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: 'c:\\Users\\DELL\\Desktop\\Nickz Construction\\backend\\.env' });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(morgan('dev'));

// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://nickz-construction-46w1.vercel.app',
  'https://nickz-construction.vercel.app', // Add your main frontend URL
  'http://10.118.145.124:8080',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Dynamic origin checking
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/team', teamRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      success: true,
      status: states[dbState] || 'unknown',
      readyState: dbState,
      host: mongoose.connection.host || 'not connected',
      database: mongoose.connection.name || 'not connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection (without app.listen for Vercel)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🔗 Host:', mongoose.connection.host);
  
  // Only start server locally, not on Vercel
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
})
.catch((error) => {
  console.error('❌ Database connection error:', error);
  // Don't exit process on Vercel
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Export for Vercel
export default app;