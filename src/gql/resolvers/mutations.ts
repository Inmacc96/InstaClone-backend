import { MutationResolvers } from "../../types/graphql";
import { createUser, authUser, updateAvatar } from "../../controllers/user";
import { Context } from "../../types/Context";

const mutations: MutationResolvers = {
  // User
  newUser: (_, { input }) => createUser(input),
  authUser: (_, { input }) => authUser(input),
  updateAvatar: (_, { urlImage }, context: Context) =>
    updateAvatar(urlImage, context),
};

export default mutations;
