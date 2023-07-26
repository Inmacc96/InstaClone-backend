import { MutationResolvers } from "../../types/graphql";
import { createUser, authUser } from "../../controllers/user";

const mutations: MutationResolvers = {
  // User
  newUser: (_, { input }) => createUser(input),
  authUser: (_, { input }) => authUser(input),
};

export default mutations;
