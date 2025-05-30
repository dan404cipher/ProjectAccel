import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';

import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
import { handleError } from 'middleware/errors';
import { setupRoutes } from './routes';

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

const establishDatabaseConnection = async (): Promise<void> => {
  console.log('🔄 Attempting to connect to database...');
  console.log('Database config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE
  });
  
  try {
    await createDatabaseConnection();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const initializeApp = async (): Promise<void> => {
  console.log('📦 Starting application initialization...');
  await establishDatabaseConnection();

  const app = express();

  app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(addRespondToResponse);

  // Setup API routes first
  setupRoutes(app);

  // Serve static files from the client directory based on environment
  const clientDir = process.env.NODE_ENV === 'production' ? 'build' : 'dev';
  app.use(express.static(path.join(__dirname, `../../client/${clientDir}`)));

  // For any other route, serve the frontend application
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, `../../client/${clientDir}`, 'index.html'));
  });

  app.use(handleError);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🌐 Server is running on http://localhost:${port}`);
  });
};

initializeApp().catch(error => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});
