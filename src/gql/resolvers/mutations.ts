import { MutationResolvers } from "../../types/graphql";
import {
  createUser,
  authUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
} from "../../controllers/user";
import { Context } from "../../types/Context";
import { followUser } from "../../controllers/follow";

const mutations: MutationResolvers = {
  // User
  newUser: (_, { input }) => createUser(input),
  authUser: (_, { input }) => authUser(input),
  updateAvatar: (_, { urlImage }, context: Context) =>
    updateAvatar(urlImage, context),
  deleteAvatar: (_, {}, context: Context) => deleteAvatar(context),
  updateUser: (_, { input }, context) => updateUser(input, context),

  // Follow
  follow: (_, { username }, context: Context) => followUser(username, context),
};

export default mutations;
