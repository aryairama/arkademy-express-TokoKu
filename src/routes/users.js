import express from 'express';
import ControllerUsers from '../controllers/ControllerUsers.js';
import ValidatonUsers from '../validations/ValidatonUsers.js';
import Auth from '../middlewares/Auth.js';

const router = express.Router();

router
  .get('/', Auth, ValidatonUsers('read'), ControllerUsers.readUser)
  .post('/', Auth, ValidatonUsers('create'), ControllerUsers.insertUser)
  .post('/login', ValidatonUsers('login'), ControllerUsers.login)
  .post('/register/custommer', ValidatonUsers('registerCustommer'), ControllerUsers.registerCustommer)
  .post('/register/seller', ValidatonUsers('registerSeller'), ControllerUsers.registerSeller)
  .post('/refreshtoken', ControllerUsers.refreshToken)
  .delete('/logout', Auth, ControllerUsers.logout)
  .post('/:id', Auth, ValidatonUsers('update'), ControllerUsers.updateUser)
  .delete('/:id', Auth, ValidatonUsers('delete'), ControllerUsers.deleteUser);

export default router;
