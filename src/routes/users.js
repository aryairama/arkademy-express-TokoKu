import express from "express";
import ControllerUsers from "../controllers/ControllerUsers.js";
import ValidatonUsers from "../validations/ValidatonUsers.js";
const router = express.Router();

router
  .get("/", ValidatonUsers("read"), ControllerUsers.readUser)
  .post("/:id", ValidatonUsers("update"), ControllerUsers.updateUser)
  .post("/register", ValidatonUsers("create"), ControllerUsers.register)
  .delete("/:id", ValidatonUsers("delete"), ControllerUsers.deleteUser);

export default router;
