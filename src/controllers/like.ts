import { GraphQLError } from "graphql";
import { Context } from "../types/Context";
import Like from "../models/like";

export const addLike = async (idPost: string, context: Context) => {
  const { currentUser } = context;

  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  // Comprobar que el usuario actual no ha dado ya like alpost
  const alreadyLikePost = await Like.findOne({
    idPost,
    idUser: currentUser.id,
  });

  if (alreadyLikePost) {
    throw new GraphQLError(`Already like this post`, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    const newLike = new Like({
      idPost,
      idUser: currentUser.id,
    });
    await newLike.save();
  } catch (err) {
    throw new GraphQLError(`Error saving the like`, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
