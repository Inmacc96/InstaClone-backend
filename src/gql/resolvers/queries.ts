import { generateUploadUrl } from "../../controllers/user";
import { QueryResolvers } from "../../types/graphql";

const queries: QueryResolvers = {
  // User
  getUser: () => {
    console.log("Getting user");
    return null;
  },
  generateUploadUrl: () => generateUploadUrl(),
};

export default queries;
