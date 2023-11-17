import { MutationResolvers } from "../../types/graphql";
import {
  createUser,
  authUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
} from "../../controllers/user";
import { Context } from "../../types/Context";
import { followUser, unFollowUser } from "../../controllers/follow";
import { publish } from "../../controllers/post";
import { addComment } from "../../controllers/comment";
import { addLike } from "../../controllers/like";

const mutations: MutationResolvers = {
  // User
  newUser: (_, { input }) => createUser(input),
  authUser: (_, { input }) => authUser(input),
  updateAvatar: (_, { urlImage }, context: Context) =>
    updateAvatar(urlImage, context),
  deleteAvatar: (_, {}, context: Context) => deleteAvatar(context),
  updateUser: (_, { input }, context: Context) => updateUser(input, context),

  // Follow
  follow: (_, { username }, context: Context) => followUser(username, context),
  unFollow: (_, { username }, context: Context) =>
    unFollowUser(username, context),

  // Post
  publish: (_, { urlFile, typeFile }, context: Context) =>
    publish(urlFile, typeFile, context),

  // Comment
  addComment: (_, { input }, context: Context) => addComment(input, context),

  // Like
  addLike: (_, { idPost }, context: Context) => addLike(idPost, context),
};

export default mutations;
