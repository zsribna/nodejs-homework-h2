import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody, isEmptyBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} from "../../models/Contact.js";
import { authenticate, isValidId } from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getContacts);

contactsRouter.get("/:id", isValidId, contactsController.getContactById);

contactsRouter.post(
  "/",
  isEmptyBody("body must have fields"),
  validateBody(contactAddSchema),
  contactsController.addContact
);

contactsRouter.delete("/:id", isValidId, contactsController.removeContact);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(contactUpdateSchema),
  isEmptyBody("body must have fields"),
  contactsController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody("missing field favorite"),
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateStatusContact
);
export default contactsRouter;
