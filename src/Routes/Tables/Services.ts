import express from "express";
import { TableServicesController } from "../../controller/Table/Services";

//// .............../Tables/Services/

export const tableServicesRoute = express.Router();
const controller = new TableServicesController();


tableServicesRoute.get("/", controller.getServices);
tableServicesRoute.post("/new", controller.addService);
tableServicesRoute.put("/edit", controller.editService);
tableServicesRoute.delete("/delete", controller.deleteServices);
tableServicesRoute.post("/transfer", controller.transferServices);


