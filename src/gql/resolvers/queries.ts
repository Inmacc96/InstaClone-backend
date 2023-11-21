import { getUser, searchUsers } from "../../controllers/user";
import { generateUploadUrl } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";
import { Context } from "../../types/Context";
import {
  getFollowers,
  getFollowings,
  isFollowingUser,
} from "../../controllers/follow";
import { getFeed, getPosts } from "../../controllers/post";
import { getComments } from "../../controllers/comment";
import { isLike, countLikes } from '../../controllers/like';

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

  // Post
  getPosts: (_, { username }) => getPosts(username),
  getFeed:(_,{}, context:Context) => getFeed(context),

  // Comments
  getComments: (_, { idPost }) => getComments(idPost),

  // Like
  isLike: (_, { idPost }, context: Context) => isLike(idPost, context),
  countLikes: (_, { idPost }) => countLikes(idPost),
};

export default queries;
