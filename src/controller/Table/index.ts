import { Request, Response } from "express";
import { CreateTableController } from "./Create_table";
import { GetTablesController } from "./Get_tables";
import { DeleteTableController } from "./Settings/delete_table";

export class TableController {
    async createTable(req: Request, res: Response) {
        const controller = new CreateTableController(req, res);
        if (controller.checkIfNoTableName()) return controller.tableNameRequired();
        const table = await controller.create();
        controller.successCreateTable(table);
    }

    async getTables(req: Request, res: Response) {
        const controller = new GetTablesController(req, res);
        const tables = await controller.get();
        res.send(tables);
    }

    async deleteTable(req: Request, res: Response) {
        const controller = new DeleteTableController(req, res);
        await controller.delete();
        res.send("Table Deleted");
    }

}