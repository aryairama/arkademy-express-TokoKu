import express from 'express';
import ControllerUsers from '../controllers/ControllerUsers.js';
import ValidatonUsers from '../validations/ValidatonUsers.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .get('/', Auth, Role('admin'), ValidatonUsers('read'), ControllerUsers.readUser)
  .post('/', Auth, Role('admin'), ValidatonUsers('create'), ControllerUsers.insertUser)
  .post('/login', ValidatonUsers('login'), ControllerUsers.login)
  .post('/register/custommer', ValidatonUsers('registerCustommer'), ControllerUsers.registerCustommer)
  .post('/register/seller', ValidatonUsers('registerSeller'), ControllerUsers.registerSeller)
  .post('/refreshtoken', ControllerUsers.refreshToken)
  .post('/verifregisteremail', ControllerUsers.verifregisteremail)
  .delete('/logout', Auth, ControllerUsers.logout)
  .post('/:id', Auth, Role('admin', 'custommer', 'seller'), ValidatonUsers('update'), ControllerUsers.updateUser)
  .delete('/:id', Auth, Role('admin', 'custommer', 'seller'), ValidatonUsers('delete'), ControllerUsers.deleteUser);

export default router;
