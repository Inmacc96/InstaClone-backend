import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import connectDB from "./config/db.config";
import resolvers from "./gql/resolvers";
import configCloudinary from "./config/cloudinary.config";
import { Context, JwtDecode } from "./types/Context";
dotenv.config({ path: ".env" });

const typeDefs = readFileSync("src/gql/schema.graphql", { encoding: "utf-8" });

const startServer = async () => {
  // Database connection
  connectDB();

  // Config cloudinary
  configCloudinary();

  // Apollo server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req })=> {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = auth.substring(7);
        const currentUser = process.env.JWT_SECRET_KEY
          ? jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtDecode
          : null;
        return { currentUser };
      }
      return { currentUser: null };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
