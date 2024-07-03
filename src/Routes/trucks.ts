import express from "express";
import { TrucksController } from "../controller/Trucks";
import { expressAsyncCatcher } from "../middlewares/errors";



//// .............../Trucks/

export const trucksRoute = express.Router();
const controller = new TrucksController();

trucksRoute.get("/", expressAsyncCatcher(controller.getTrucks));