import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import jimp from "jimp";
import { nanoid } from "nanoid";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const url = gravatar.url(email, { s: "300", r: "g", d: "robohash" }, false);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: url,
    verificationToken,
  });

  const msg = {
    to: email,
    subject: "Verify email",
    text: "Verify your email address to log in",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };
  await sendEmail(msg);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: url,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      verificationToken: null,
      verify: true,
    },
    { runValidators: false }
  );
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const msg = {
    to: email,
    subject: "Verify email",
    text: "Verify your email address to log in",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(msg);

  res.json({
    message: "Verification email sent",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "No content",
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findOneAndUpdate(_id, req.body);
  const { subscription, email, updatedAt } = result;
  res.json({ email, subscription, updatedAt });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const imageAvatar = await jimp.read(oldPath);
  imageAvatar.resize(250, 250, jimp.RESIZE_BEZIER);
  await imageAvatar.writeAsync(oldPath);

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const avatar = path.join("avatars", filename);

  const result = await User.findOneAndUpdate(_id, { avatarURL: avatar });
  const { avatarURL } = result;
  res.json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
