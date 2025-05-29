import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';

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

const initializeExpress = (): void => {
  console.log('🚀 Initializing Express application...');
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new RouteNotFoundError((req as any).originalUrl));
  });
  app.use(handleError);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🌐 Server is running on http://localhost:${port}`);
  });
};

const initializeApp = async (): Promise<void> => {
  console.log('📦 Starting application initialization...');
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp().catch(error => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});
