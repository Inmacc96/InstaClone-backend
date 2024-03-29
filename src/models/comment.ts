import { Schema, model } from "mongoose";
import { Comment } from "../types/graphql";

const CommentSchema = new Schema({
  idPost: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Post"
  },
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  comment: {
    type: String,
    trim: true,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<Comment>("Comment", CommentSchema);
