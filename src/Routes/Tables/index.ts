import express from "express";
import { CreateTableController } from "../../controller/Table/Create_table";
import { GetTablesController } from "../../controller/Table/Get_tables";
import { tableServicesRoute } from "./Services";
import { tableSettingsRoute } from "./Settings";



//// .............../Tables/

export const tablesRoute = express.Router();

// Sub Routes
tablesRoute.use("/services", tableServicesRoute);
tablesRoute.use("/settings", tableSettingsRoute);


tablesRoute.post("/newtable", async (req, res) => {
    const controller = new CreateTableController(req, res);
    if (controller.checkIfNoTableName()) return controller.tableNameRequired();
    await controller.create();
    controller.successCreateTable();
});

tablesRoute.get("/", async (req, res) => {
    const controller = new GetTablesController(req, res);
    const tables = await controller.get();
    res.send(tables);
});


