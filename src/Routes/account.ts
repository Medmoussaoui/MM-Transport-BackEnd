import express from "express";
import { AccountController } from "../controller/Account";
import { expressAsyncCatcher } from "../middlewares/errors";


//// .............../Account/

export const accountRoute = express.Router();
const controller = new AccountController();

accountRoute.post("/login", expressAsyncCatcher(controller.login));
accountRoute.post("/changepassword", expressAsyncCatcher(controller.changePassword));