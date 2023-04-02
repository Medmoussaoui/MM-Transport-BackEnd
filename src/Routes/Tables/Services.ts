import express from "express";
import { TableServicesController } from "../../controller/Table/Services";
import { expressAsyncCatcher } from "../../middlewares/errors";

//// .............../Tables/Services/

export const tableServicesRoute = express.Router();
const controller = new TableServicesController();


tableServicesRoute.get("/", expressAsyncCatcher(controller.getServices));
tableServicesRoute.post("/new", expressAsyncCatcher(controller.addService));
tableServicesRoute.put("/edit", expressAsyncCatcher(controller.editService));
tableServicesRoute.delete("/delete", expressAsyncCatcher(controller.deleteServices));
tableServicesRoute.post("/transfer", expressAsyncCatcher(controller.transferServices));


