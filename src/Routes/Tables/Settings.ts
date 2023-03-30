import express from "express";
import { TableSettingsController } from "../../controller/Table/Settings";


//// .............../Tables/Settings/

export const tableSettingsRoute = express.Router();

const controller = new TableSettingsController();

tableSettingsRoute.put("/rename", controller.renameTable);
tableSettingsRoute.delete("/delete/:tableId", controller.deleteTable);