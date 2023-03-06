import mongoose, { MongooseError } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const connectDB = () => {
  mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then((db) => {
      const url = `${db.connection.host}: ${db.connection.port}`;
      console.log(`MongoDB connected at ${url}`);
    })
    .catch((err: MongooseError) => {
      console.log(`Error: ${err.message}`);
      process.exit(1);
    });
};

export default connectDB;
