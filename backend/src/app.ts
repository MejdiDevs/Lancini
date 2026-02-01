import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import cvRoutes from './routes/cvRoutes';
import cvAnalysisRoutes from './routes/cvAnalysisRoutes';
import interviewRoutes from './routes/interviewRoutes';
import editionsRoutes from './routes/editionsRoutes';
import docsRoutes from './routes/docsRoutes';
import messageRoutes from './routes/messageRoutes';
import jobRoutes from './routes/jobRoutes';
import profileRoutes from './routes/profileRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/cv-analysis', cvAnalysisRoutes);
app.use('/api/editions', editionsRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/docs', docsRoutes);

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>ENET'Com Forum API</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
          }
          h1 { color: #667eea; margin-bottom: 1rem; }
          p { color: #666; margin-bottom: 2rem; }
          a {
            display: inline-block;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.2s;
          }
          a:hover { transform: translateY(-2px); }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 ENET'Com Forum API</h1>
          <p>Backend is running successfully!</p>
          <a href="/api/docs">View API Documentation →</a>
        </div>
      </body>
    </html>
  `);
});

export default app;
