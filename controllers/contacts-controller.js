import contactsService from "../models/contacts/index.js";

import { HttpError } from "../helpers/index.js";

const getAll = async (req, res, next) => {
    try {
        const result = await contactsService.listContacts();

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.getContactById(contactId);
        if (!result) {
            throw HttpError(404, `Contact with id=${contactId} not found`);    
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        const result = await contactsService.addContact(req.body);

        res.status(201).json(result)
    }
    catch (error) {
        next(error);
    }
}

const updateById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.updateContact(contactId, req.body);
        if (!result) {
            throw HttpError(404, `Contact with id=${contactId} not found`);
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const deleteById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.removeContact(contactId);
        if (!result) {
            throw HttpError(404, `Contact with id=${contactId} not found`);
        }

        res.json({
            message: "Contact deleted"
        })
    }
    catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getById,
    add,
    updateById,
    deleteById,
}