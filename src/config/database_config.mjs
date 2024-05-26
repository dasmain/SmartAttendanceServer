import { config } from "dotenv";

//mount the .env file
config();

const databaseConfig = {
  // Database configuration
  database: {
    uri: process.env.MONGO_DB_URI,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

export default databaseConfig;
