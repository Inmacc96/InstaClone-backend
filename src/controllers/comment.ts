import { GraphQLError } from "graphql";
import Comment from "../models/comment";
import User from "../models/user";
import Post from "../models/post";
import { Context } from "../types/Context";
import {
  CommentInput,
  User as UserType,
  Post as PostType,
} from "../types/graphql";

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

    const savedComment = await Comment.findById(newComment._id)
      .populate<{ idUser: UserType }>("idUser")
      .populate<{ idPost: PostType }>("idPost");
    if (!savedComment) {
      throw new GraphQLError("Comment not found after saving", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
    return savedComment;
  } catch (err) {
    throw new GraphQLError("Error saving the new comment in the database", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

export const getComments = async (idPost: string) => {
  // Comprobar que existe el post
  let post = await Post.findById(idPost);
  if (!post) {
    throw new GraphQLError("Post not found", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  // Obtener los comentarios del post
  const comments = await Comment.find({ idPost })
    .populate<{ idUser: UserType }>("idUser")
    .populate<{ idPost: PostType }>("idPost");
  return comments;
};
