import { GraphQLError } from "graphql";
import User from "../models/user";
import Follow from "../models/follow";
import { Context } from "../types/Context";

export const followUser = async (username: string, context: Context) => {
  const { currentUser } = context;

  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  // Comprobar que el usuario a seguir existe
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Comprobar que el usuario actual no sigue al usuario a seguir
  const alreadyFollowing = await Follow.findOne({
    idUser: currentUser.id,
    follow: foundUser._id,
  });

  if (alreadyFollowing) {
    throw new GraphQLError(`Already follow to ${username}`, {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  try {
    const follow = new Follow({
      idUser: currentUser.id,
      follow: foundUser._id,
    });
    await follow.save();
  } catch (err) {
    throw new GraphQLError("Error saving the new user in the database", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

export const isFollowingUser = async (username: string, context: Context) => {
  const { currentUser } = context;

  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  // Comprobar que el posible usuario seguido existe
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Comprobar si el usuario logeado sigue a username
  const isFollowing = await Follow.findOne({
    idUser: currentUser.id,
    follow: foundUser._id,
  });

  return !!isFollowing;
};
