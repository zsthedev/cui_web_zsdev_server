import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Posts } from "../models/Post.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const getMyPosts = () =>
  catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    // let posts = await
  });

export const createPost = () =>
  catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const { post } = req.body;

    const file = req.file;

    if (!post) {
      return next(new ErrorHandler("Please enter all feilds", 404));
    }

    if (file) {
      const fileUri = getDataUri(file);
      const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
      let newPost = await Post.create({
        post: post,
        author: user._id,

        file: {
          public_id: mycloud._id,
          url: mycloud.secure_url,
        },
      });

      user.posts.push(newPost._id);
    } else {
      let newPost = await Post.create({
        author: user._id,
        post: post,

        file: {
          public_id: "temp_id",
          url: "temp_url",
        },
      });

      user.posts.push(newPost._id);
    }

    await user.save();

    res.status(200).json({
      sucess: true,
      message: "Post Create Successfully",
    });
  });
