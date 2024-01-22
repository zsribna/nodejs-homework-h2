import express from "express";
import { validateBody, isEmptyBody } from "../../decorators/index.js";
import {
  authenticate,
  isFileUploaded,
  upload,
} from "../../middlewares/index.js";
import {
  userSignupSchema,
  userSigninSchema,
  subsUpdateSchema,
  userEmailSchema,
} from "../../models/User.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody("body must have fields"),
  validateBody(userSignupSchema),
  authController.signup
);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post(
  "/verify",
  isEmptyBody("body must have fields"),
  validateBody(userEmailSchema),
  authController.resendVerifyEmail
);
authRouter.post(
  "/login",
  isEmptyBody("body must have fields"),
  validateBody(userSigninSchema),
  authController.signin
);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.patch(
  "/",
  authenticate,
  isEmptyBody("body must have fields"),
  validateBody(subsUpdateSchema),
  authController.updateSubscription
);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  isFileUploaded,
  authController.updateAvatar
);

export default authRouter;
