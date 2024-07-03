import express from "express";
import { TableServicesController } from "../../controller/Table/Services";
import { expressAsyncCatcher } from "../../middlewares/errors";
import { isAuthorized } from "../../middlewares/auth";

//// .............../Tables/Services/

export const tableServicesRoute = express.Router();
const controller = new TableServicesController();


tableServicesRoute.get("/", isAuthorized, expressAsyncCatcher(controller.getServices));
tableServicesRoute.post("/transfer", expressAsyncCatcher(controller.transferServices));


