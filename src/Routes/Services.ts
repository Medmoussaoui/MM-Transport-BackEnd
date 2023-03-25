import express from "express";
import { ServicesController } from "../controller/services";

export const servicesRoute = express.Router();
const controller = new ServicesController();

servicesRoute.get("/", (req, res) => {
    res.send("Get Services");
});

servicesRoute.post("/new", controller.add);

servicesRoute.put("/edit", controller.edit);

servicesRoute.delete("/delete", controller.delete);

/// https://www.api.transport/services/transfer/dsds454dq4s54ds5q4dq5s4
servicesRoute.post("/transfer/:tableId", (req, res) => { });