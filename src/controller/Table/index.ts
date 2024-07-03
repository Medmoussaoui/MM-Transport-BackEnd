import { Request, Response } from "express";
import { CreateTableControllerExTwo } from "./Create_table";
import { GetTablesController } from "./Get_tables";
import { ImportantResponceModel } from "../../module/important_responce_model";
import { AppResponce } from "../../core/constant/appResponce";

export class TableController {
    async createTable(req: Request, res: Response) {

        // const controller = new CreateTableController(req, res);
        // if (controller.checkIfNoTableName()) return controller.tableNameRequired();
        // const table = await controller.create();
        // controller.successCreateTable(table[0]);

        const controller = new CreateTableControllerExTwo(req, res);
        if (controller.checkIfNoTableName()) return await controller.tableNameRequired();
        const table = await controller.create();
        controller.successCreateTable(table);

    }

    async getTables(req: Request, res: Response) {
        const controller = new GetTablesController(req, res);
        const tables = await controller.get();
        res.send(tables);
    }
}