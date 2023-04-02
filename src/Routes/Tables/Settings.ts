import express from "express";
import { TableSettingsController } from "../../controller/Table/Settings";
import { expressAsyncCatcher } from "../../middlewares/errors";


//// .............../Tables/Settings/

export const tableSettingsRoute = express.Router();

const controller = new TableSettingsController();

tableSettingsRoute.put("/rename", expressAsyncCatcher(controller.renameTable));
tableSettingsRoute.delete("/delete/:tableId", expressAsyncCatcher(controller.deleteTable));