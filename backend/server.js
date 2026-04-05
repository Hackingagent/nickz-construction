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

// Configure dotenv
// dotenv.config({ path: 'c:\\Users\\DELL\\Desktop\\Nickz Construction\\backend\\.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
// app.use(helmet()); // Temporarily disabled for debugging
app.use(morgan('dev'));

// Configure CORS - Use ONLY this, remove manual middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://nickz-construction-46w1.vercel.app',
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
  optionsSuccessStatus: 200 // For legacy browsers
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Accessible at: http://0.0.0.0:${PORT}`);
      console.log(`Local access: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

export default app;