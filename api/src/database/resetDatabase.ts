import mongoose from 'mongoose';

const resetDatabase = async (): Promise<void> => {
  const collections = await mongoose.connection.db.collections();
  
  for (const collection of collections) {
    await collection.drop();
  }
};

export default resetDatabase;
