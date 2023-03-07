import { MutationResolvers } from "../../types/graphql";
import { createUser } from "../../controllers/user";

const mutations: MutationResolvers = {
  // User
  newUser: async (_, { input }) => createUser(input),
};

export default mutations;
