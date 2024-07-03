import { Request, Response } from "express";
import { DeleteTableController } from "./delete_table";
import { RenameTableController } from "./Rename_table";

export class TableSettingsController {

    async renameTable(req: Request, res: Response) {
        const controller = new RenameTableController(req, res);
        if (!controller.checkInput()) {
            return controller.invalidBodyInput();
        }
        await controller.rename();
        return controller.successChangeTableName();
    }

    async deleteTable(req: Request, res: Response) {
        const controller = new DeleteTableController(req, res);
        await controller.delete();
        return controller.successDeleteTable();
    }
}