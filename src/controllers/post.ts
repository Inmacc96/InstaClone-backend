import { GraphQLError } from "graphql";
import User from "../models/user";
import Post from "../models/post";
import { User as UserType } from "../types/graphql";
import { Context } from "../types/Context";

export const publish = async (urlFile: string, typeFile: string, context: Context) => {
  const { currentUser } = context;
  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  const { id } = currentUser;

  // Comprobar que el usuario existe
  let user = (await User.findById(id)) as UserType | null;
  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    const newPost = new Post({ idUser: id, urlFile, typeFile });
    await newPost.save();
    return newPost;
  } catch (err) {
    throw new GraphQLError("Error saving the new post in the database", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
