import express from "express";
import { validateBody, isEmptyBody } from "../../decorators/index.js";
import { authenticate } from "../../middlewares/index.js";
import { userSignupSchema, userSigninSchema, subsUpdateSchema } from "../../models/User.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody("body must have fields"),
  validateBody(userSignupSchema),
  authController.signup
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

export default authRouter;
