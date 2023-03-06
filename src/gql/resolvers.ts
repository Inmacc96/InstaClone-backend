import { Resolvers } from "../types/graphql";

const resolvers: Resolvers = {
  Query: {
    // User
    getUser: () => {
      console.log("Getting user");
      return null;
    },
  },
  Mutation: {
    // User
    createUser: () => {
      console.log("Creating user...");
      return null;
    },
  },
};

export default resolvers;
