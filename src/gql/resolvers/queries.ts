import { getUser, searchUsers } from "../../controllers/user";
import { generateUploadUrl } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";
import { Context } from "../../types/Context";
import {
  getFollowers,
  getFollowings,
  isFollowingUser,
} from "../../controllers/follow";

const queries: QueryResolvers = {
  // User
  getUser: (_, { id, username }) => getUser({ id, username }),
  generateUploadUrl: (_, { folder, uploadType }, context: Context) =>
    generateUploadUrl(folder, uploadType, context),
  searchUsers: (_, { search }) => searchUsers(search),

  // Follow
  isFollowing: (_, { username }, context: Context) =>
    isFollowingUser(username, context),
  getFollowers: (_, { username }) => getFollowers(username),
  getFollowings: (_, { username }) => getFollowings(username),
};

export default queries;
