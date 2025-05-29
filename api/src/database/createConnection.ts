import { createConnection, Connection } from 'typeorm';

import * as entities from 'entities';

const createDatabaseConnection = async (): Promise<Connection> => {
  console.log('Creating database connection...');

  try {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'danushtom',
      database: 'jira_development',
      entities: Object.values(entities),
      synchronize: true,
      logging: true
    });
    
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default createDatabaseConnection;
