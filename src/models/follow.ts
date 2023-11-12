import { Schema, model } from "mongoose";

const FollowSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  follow: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Follow", FollowSchema);
