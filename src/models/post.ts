import { Schema, model } from "mongoose";
import { Post } from "../types/graphql";

const PostSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  urlFile: {
    type: String,
    trim: true,
    require: true,
  },
  typeFile: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<Post>("Post", PostSchema);
