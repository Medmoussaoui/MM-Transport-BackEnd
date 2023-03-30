import { Request, Response } from "express";
import { TablesModule } from "../../../module/tables.model";
import { CreateTableController } from "../Create_table";
import { DeleteTableController } from "./delete_table";
import { RenameTableController } from "./Rename_table";

export class TableSettingsController {

    async renameTable(req: Request, res: Response) {
        const controller = new RenameTableController(req, res);
        if (!controller.checkInput()) return controller.invalidBodyInput();
        const result = await controller.rename();
        if (result == 1) return controller.successChangeTableName();
        controller.faildChangeTableName();
    }

    async deleteTable(req: Request, res: Response) {
        const controller = new DeleteTableController(req, res);
        const result = await controller.delete();
        if (result == 1) return controller.successDeleteTable();
        controller.faildDeleteTable();
    }
}