import mongoose from 'mongoose';
export const connectToDatabase = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    // eslint-disable-next-line no-console
    console.log('Connected to the database');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error connecting to the database', error);
    process.exit(1);
  }
};
