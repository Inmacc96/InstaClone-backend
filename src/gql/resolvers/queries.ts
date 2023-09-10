import { getUser } from "../../controllers/user";
import { generateUploadUrl } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";
import { Context } from '../../types/Context';

const queries: QueryResolvers = {
  // User
  getUser: (_, { id, username }) => getUser({ id, username }),
  generateUploadUrl: (_, { folder }, context: Context) =>
    generateUploadUrl({ folder }, context),
};

export default queries;
