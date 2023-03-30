import express from "express";
import { ServicesController } from "../controller/services";


//// .............../Services/

export const servicesRoute = express.Router();
const controller = new ServicesController();

servicesRoute.get("/", controller.getServices);

servicesRoute.post("/new", controller.addService);

servicesRoute.put("/edit", controller.editService);

servicesRoute.delete("/delete", controller.deleteService);

/// https://www.api.transport/services/transfer/dsds454dq4s54ds5q4dq5s4
servicesRoute.post("/transfer/:tableId", (req, res) => { });