import { getUser } from "../../controllers/user";
import { generateUploadUrl } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";

const queries: QueryResolvers = {
  // User
  getUser: (_, { id, username }) => getUser({ id, username }),
  generateUploadUrl: (_, { folder }) => generateUploadUrl({ folder }),
};

export default queries;
