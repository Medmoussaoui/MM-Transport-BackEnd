import { Request, Response } from "express";
import { TablesModule } from "../../../module/tables.model";

export class RenameTableController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    successChangeTableName(): void {
        this.res.send("Table Name Changed Successfully");
    }

    invalidBodyInput(): void {
        this.res.status(400).send('bad Request');
    }

    checkInput() {
        const { newName, tableId } = this.req.body;
        if (newName == undefined && newName == "") return false;
        if (tableId == undefined && tableId == "") return false;
        return true;
    }

    async rename(): Promise<number> {
        const { newName, tableId } = this.req.body;
        return await TablesModule.updateTableName(newName, tableId);
    }

}