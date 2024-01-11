
import {HttpError} from "../helpers/index.js";
import { contactAddSchema, contactUpdateSchema, contactUpdFavoriteSchema  } from "../models/contacts.js";
import { controllerWrapper } from "../decorators/index.js";
import Contact from "../models/contacts.js";



 async function getAll (req, res){
    const result = await Contact.find({}, '-createdAt -updatedAt');
    res.json(result); 
}

async function getById  (req, res ) { 
  const { id } = req.params;
  console.log(id);
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);  
}

async function postContacts (req, res) {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await Contact.create(req.body);
  res.status(201).json(result);  
}

async function deleteById (req, res) {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Contact with id = ${id} not found`);
    } 
     res.json(result)  
} 


async function updateById(req, res) {
 
  const { error } = contactUpdateSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message)
  } 
  const { id } = req.params;
  
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw  HttpError(404, `Contact with id=${id} not found`)
  }
  res.json(result);   
}

async function updateStatusContact(req, res) {
   const { error } = contactUpdFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing field favorite");
    }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body)
   if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`)
  }
  res.json(result);   

}

export default {
    getAll: controllerWrapper(getAll),
    getById: controllerWrapper(getById),
    postContacts: controllerWrapper(postContacts),
    deleteById: controllerWrapper(deleteById),
    updateById: controllerWrapper(updateById),
    updateStatusContact: controllerWrapper(updateStatusContact),
    
}


