import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const file = req.file;

  if (!name || !email || !password || !file || !role) {
    return next(new ErrorHandler("Please Enter All Feilds", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 409));
  }

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    name: name,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    role: role,
    email: email,
    password: password,
  });
  sendToken(res, user, "Registered Successfully", 200);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter All Feilds", 400));
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 409));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  sendToken(res, user, `Welcome Back ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      sameSite: "none",
      secure: true,

      expires: new Date(Date.now()),
    })
    .json({
      sucess: true,
      message: "User Logged Out Sucessfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    sucess: true,
    user,
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { email, name } = req.body;

  if (email) user.email = email;
  if (name) user.name = name;

  await user.save();
  res.status(200).json({
    sucess: true,
    message: "Profile has been updated successfully",
  });
});

export const follow = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { id } = req.params;

  const toFollow = await User.findById(id);

  if (!toFollow) {
    return next(new ErrorHandler("Invalid Friend ID", 404));
  }

  const already = user.following.filter((f) => f.id.toString() === toFollow._id.toString())
  console.log(already.length);
  if (already.length > 0) {
    return next(new ErrorHandler("You already follow", 404));
  } else {
    user.following.push({
      id: toFollow._id,
    });

    toFollow.followers.push({
      id: user._id
    })
  }

  await user.save();
  await toFollow.save();
  res.status(200).json({
    sucess: true,
    message: "Profile has been updated successfully",
    following: user.following,
  });
});
