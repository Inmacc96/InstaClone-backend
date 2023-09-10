import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const configCloudinary = () => {
  return cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key: `${process.env.CLOUDINARY_NAME}`,
    api_secret: `${process.env.CLOUDINARY_NAME}`,
  });
};

export default configCloudinary;
