import { GraphQLError } from "graphql";
import User from "../models/user";
import Post from "../models/post";
import Follow from "../models/follow";
import { FeedPost, User as UserType } from "../types/graphql";
import { Context } from "../types/Context";

export const publish = async (
  urlFile: string,
  typeFile: string,
  context: Context
) => {
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

export const getPosts = async (username: string) => {
  // Comprobar que el usuario existe
  let user = (await User.findOne({ username })) as UserType | null;
  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  //Obtener los posts de user
  const posts = await Post.find({ idUser: user.id }).sort({ createdAt: -1 });
  return posts;
};

export const getFeed = async (context: Context) => {
  const { currentUser } = context;
  if (!currentUser)
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  // Obtener los usuarios que sigue currentUser
  const followings = await Follow.find({ idUser: currentUser.id });

  // Obtener las publicaciones de los usuarios que sigue currentUser
  const postsList: FeedPost[] = [];

  for await (const data of followings) {
    const posts = await Post.find({ idUser: data.follow })
      .sort({
        createdAt: -1,
      })
      .populate<{ idUser: UserType }>("idUser")
      .limit(5);

    postsList.push(...(posts as FeedPost[]));
  }

  return postsList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
