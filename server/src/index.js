import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '../config/database.js';
import router from '../routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// DB connectivity test
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ status: 'Database connected', data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', message: error.message });
  }
});

// All API routes (cultures, parcelles, alertes, meteo, observations, type-cultures…)
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
