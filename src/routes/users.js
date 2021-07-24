import express from 'express';
import ControllerUsers from '../controllers/ControllerUsers.js';
import ValidatonUsers from '../validations/ValidatonUsers.js';

const router = express.Router();

router
  .get('/', ValidatonUsers('read'), ControllerUsers.readUser)
  .post('/', ValidatonUsers('create'), ControllerUsers.insertUser)
  .post('/login', ValidatonUsers('login'), ControllerUsers.login)
  .post('/register/custommer', ValidatonUsers('registerCustommer'), ControllerUsers.registerCustommer)
  .post('/register/seller', ValidatonUsers('registerSeller'), ControllerUsers.registerSeller)
  .post('/:id', ValidatonUsers('update'), ControllerUsers.updateUser)
  .delete('/:id', ValidatonUsers('delete'), ControllerUsers.deleteUser);

export default router;
