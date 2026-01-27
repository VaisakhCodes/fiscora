const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// ...

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Debug Logging Middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url} (Original: ${req.originalUrl})`);
  next();
});

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Mount routes on both /api and root paths to handle Vercel rewriting behavior
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/expenses', '/expenses'], expenseRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Spend Analyzer API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Only skip listen if we are in Vercel Serverless context
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
