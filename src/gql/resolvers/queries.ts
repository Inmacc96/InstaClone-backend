import { getUser, searchUsers } from "../../controllers/user";
import { generateUploadUrl } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";
import { Context } from "../../types/Context";
import { isFollowingUser } from "../../controllers/follow";

const queries: QueryResolvers = {
  // User
  getUser: (_, { id, username }) => getUser({ id, username }),
  generateUploadUrl: (_, { folder }, context: Context) =>
    generateUploadUrl({ folder }, context),
  searchUsers: (_, { search }) => searchUsers(search),
  isFollowing: (_, { username }, context: Context) => isFollowingUser(username, context),
};

export default queries;
