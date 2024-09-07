import express from "express";

import { addUsers, deleteUser, getUserById, getUsers, updateUser } from "../controller/users-controllers.js";

const routers  = express.Router();

// ------ Routes -------//
routers.post('/add',addUsers);
routers.get('/all',getUsers);
routers.get('/:id',getUserById);
routers.patch('/:id',updateUser);
routers.delete('/:id',deleteUser);




export default routers;
