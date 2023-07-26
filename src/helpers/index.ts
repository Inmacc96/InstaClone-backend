import jwt from "jsonwebtoken";
import { User } from "../types/graphql";

export const createToken = (
  user: User,
  secret: jwt.Secret,
  expiresIn: string
): string => {
  const { id, email, username, name } = user;
  return jwt.sign({ id, email, username, name }, secret, { expiresIn });
};
