import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { isEmptyBody,validateUpdate, validateAdd} from "../../middlewares/index.js";

const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateAdd, contactsController.add)

contactsRouter.delete('/:contactId', contactsController.deleteById)

contactsRouter.put('/:contactId', isEmptyBody, validateUpdate, contactsController.updateById)

export default contactsRouter;
