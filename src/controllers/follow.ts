import { GraphQLError } from "graphql";
import User from "../models/user";
import Follow from "../models/follow";
import { Context } from "../types/Context";
import { User as UserType } from "../types/graphql";

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
    throw new GraphQLError(`Error following to ${username}`, {
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

export const unFollowUser = async (username: string, context: Context) => {
  const { currentUser } = context;

  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  // Comprobar que el usuario a dejar de seguir existe
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Comprobar que el usuario sigue a username
  const isFollowing = await Follow.findOne({
    idUser: currentUser.id,
    follow: foundUser._id,
  });

  if (!isFollowing) {
    throw new GraphQLError(`No follow to ${username}`, {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Eliminar el registro de Follow
  try {
    await Follow.deleteOne({ idUser: currentUser.id, follow: foundUser._id });
  } catch (err) {
    throw new GraphQLError(`Error unfollowing to ${username}`, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

export const getFollowers = async (username: string) => {
  // Comprobar que el usuario existe
  const user = await User.findOne({ username });

  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Obtener los usuarios que siguen a user
  const followers = await Follow.find({ follow: user._id }).populate<{
    idUser: UserType;
  }>("idUser");

  const followersList: UserType[] = [];

  for await (const data of followers) {
    followersList.push(data.idUser);
  }

  return followersList;
};

export const getFollowings = async (username: string) => {
  // Comprobar que el usuario existe
  const user = await User.findOne({ username });

  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
        argumentName: "username",
      },
    });
  }

  // Obtener los usuarios que está siguiendo user
  const followings = await Follow.find({ idUser: user._id }).populate<{
    follow: UserType;
  }>("follow");

  const followingsList: UserType[] = [];

  for await (const data of followings) {
    followingsList.push(data.follow);
  }

  return followingsList;
};

export const getNotFollowings = async (context: Context) => {
  const { currentUser } = context;

  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  // Obtenemos 50 usuarios
  const users = await User.find().limit(50);

  const notFollowings = [];
  for await (const user of users) {
    const isFind = await Follow.findOne({
      idUser: currentUser.id,
      follow: user.id,
    });
    if (!isFind && user.id !== currentUser.id) {
      notFollowings.push(user);
    }
  }

  return notFollowings;
};
