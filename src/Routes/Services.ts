import express from "express";
import { ServicesController } from "../controller/services";
import { expressAsyncCatcher } from "../middlewares/errors";


//// .............../Services/

export const servicesRoute = express.Router();
const controller = new ServicesController();

servicesRoute.get("/", expressAsyncCatcher(controller.getServices));

servicesRoute.post("/new", expressAsyncCatcher(controller.addService));

servicesRoute.put("/edit", expressAsyncCatcher(controller.editService));

servicesRoute.post("/delete", expressAsyncCatcher(controller.deleteService));

/// https://www.api.transport/services/transfer/dsds454dq4s54ds5q4dq5s4
servicesRoute.post("/transfer/custom", expressAsyncCatcher(controller.customTransferServices));
servicesRoute.post("/transfer/auto", expressAsyncCatcher(controller.smartTransferServices));