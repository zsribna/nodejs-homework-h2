import express from "express";

import contactsControllers from '../../controllers/contactsControllers.js';

import {isEmptyBody, isValidId} from "../../middlewares/index.js";


const contactsRouter = express.Router();


contactsRouter.get('/', contactsControllers.getAll);

contactsRouter.get('/:id', isValidId, contactsControllers.getById);

contactsRouter.post('/',isEmptyBody, contactsControllers.postContacts);

contactsRouter.delete('/:id', isValidId, contactsControllers.deleteById);

contactsRouter.put('/:id',  isValidId, isEmptyBody, contactsControllers.updateById);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyBody, contactsControllers.updateStatusContact);


export default contactsRouter;
