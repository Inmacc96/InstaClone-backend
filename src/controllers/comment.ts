import { GraphQLError } from "graphql";
import Comment from "../models/comment";
import User from "../models/user";
import { Context } from "../types/Context";
import { CommentInput, User as UserType } from "../types/graphql";

export const addComment = async (input: CommentInput, context: Context) => {
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

  const { idPost, comment } = input;

  try {
    const newComment = new Comment({ idPost, idUser: id, comment });
    await newComment.save();
    return newComment;
  } catch (err) {
    throw new GraphQLError("Error saving the new comment in the database", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
