import mongoose from 'mongoose';

const createDatabaseConnection = async (): Promise<typeof mongoose> => {
  console.log('Creating database connection...');

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jira_development', {
      // MongoDB connection options
    });
    
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default createDatabaseConnection;
