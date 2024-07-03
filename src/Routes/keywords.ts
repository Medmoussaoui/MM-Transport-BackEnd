import { ServiceKeywordsController } from "../controller/Keywords";
import { expressAsyncCatcher } from "../middlewares/errors";
import express, { Request, Response } from "express";

//// .............../keywords/

export const keywordsRoute = express.Router();

const controller = new ServiceKeywordsController();

keywordsRoute.get("/", (req: Request, res: Response) => {
    res.send("ddsdsdshiiiiiiiiiii")
});

keywordsRoute.get("/boatname/:boatName", expressAsyncCatcher(controller.boatNameKeywords));
keywordsRoute.get("/servicetype/:serviceType", expressAsyncCatcher(controller.serviceTypeKeywords));