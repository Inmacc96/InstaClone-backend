import { ApolloServer, BaseContext } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import connectDB from "./config/db.config";
import resolvers from "./gql/resolvers";

const typeDefs = readFileSync("src/gql/schema.graphql", { encoding: "utf-8" });

const startServer = async () => {
  // Database connection
  connectDB();

  // Apollo server
  const server = new ApolloServer<BaseContext>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
