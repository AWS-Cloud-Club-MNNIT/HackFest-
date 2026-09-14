import mongoose from 'mongoose';
import dns from 'dns';

// Set public DNS servers to resolve MongoDB Atlas SRV query issues
// on some local networks/DNS configurations.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('\n❌ FATAL ERROR: MONGO_URI is missing!');
      console.error(
        '👉 Please make sure you have created a .env file and added your MONGO_URI string.\n'
      );
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);

    console.log('\n✨ Database Connected Successfully!');
    console.log(`🚀 Host: ${conn.connection.host}\n`);
  } catch (error) {
    console.error('\n❌ Failed to connect to the Database!');
    console.error(`👉 Reason: ${error.message}\n`);
    process.exit(1);
  }
};

export default connectDB;