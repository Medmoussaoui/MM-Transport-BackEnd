import express, { Request, Response } from "express";
import { AccountController } from "../controller/Account";
import { expressAsyncCatcher } from "../middlewares/errors";
import { isAuthenticated } from "../middlewares/auth";


//// .............../Account/

export const accountRoute = express.Router();
const controller = new AccountController();


accountRoute.post("/login", expressAsyncCatcher(controller.login));

accountRoute.post(
    "/changepassword",
    isAuthenticated,
    expressAsyncCatcher(controller.changePassword)
);