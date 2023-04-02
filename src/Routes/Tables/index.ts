import express from "express";
import { Container } from "winston";
import { TableController } from "../../controller/Table";
import { CreateTableController } from "../../controller/Table/Create_table";
import { GetTablesController } from "../../controller/Table/Get_tables";
import { expressAsyncCatcher } from "../../middlewares/errors";
import { tableServicesRoute } from "./Services";
import { tableSettingsRoute } from "./Settings";



//// .............../Tables/

export const tablesRoute = express.Router();
const controller = new TableController();


// Sub Routes
tablesRoute.use("/services", tableServicesRoute);
tablesRoute.use("/settings", tableSettingsRoute);



tablesRoute.post("/createTable", expressAsyncCatcher(controller.createTable));
tablesRoute.get("/",expressAsyncCatcher(controller.getTables));
tablesRoute.delete("/:tableId",expressAsyncCatcher(controller.deleteTable));


