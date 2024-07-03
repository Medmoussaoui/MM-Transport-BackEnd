import express from "express";
import { TableController } from "../../controller/Table";
import { expressAsyncCatcher } from "../../middlewares/errors";
import { tableServicesRoute } from "./Services";
import { tableSettingsRoute } from "./Settings";
import { isAuthorized } from "../../middlewares/auth";



//// .............../Tables/

export const tablesRoute = express.Router();
const controller = new TableController();


// Sub Routes
tablesRoute.use("/services", tableServicesRoute);
tablesRoute.use("/settings", isAuthorized, tableSettingsRoute);


tablesRoute.get("/", expressAsyncCatcher(controller.getTables));

tablesRoute.post("/createTable",
    isAuthorized,
    expressAsyncCatcher(controller.createTable),
);


