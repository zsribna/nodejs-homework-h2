import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Not authorized"));
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || token !== user.token) {
      return next(HttpError(401));
    }
    //додаємо об'єкт user в об'єкт запиту req, який далі предається усім наступним midlewar-ам
    //та в кінці опиниться у контроллері addContact, там візьметься значення ключа id user-a та додасться ключ owner, в який запишемо цей id
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
export default authenticate;
