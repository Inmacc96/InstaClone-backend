import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectDB from "./config/db.config";
import typeDefs from "./gql/schema";
import resolvers from "./gql/resolvers";

const startServer = async () => {
  // Database connection
  connectDB();

  // Apollo server
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
