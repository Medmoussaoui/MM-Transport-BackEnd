import { Request, Response } from "express";
import { TablesModule } from "../../../module/tables.model";
import { AddServiceController } from "../../services/add_service_controller";

export class AddServiceTableController extends AddServiceController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.req = req;
        this.res = res;
    }


    verifyInput(): boolean {
        const { tableId } = this.req.body;
        if (tableId == undefined || tableId == "") return false;
        return super.verifyInput();
    }

    invalidTableId() {
        this.res.status(401).send("invalid Table");
    }

    async checkTableId(): Promise<boolean> {
        const { tableId } = this.req.body;
        const table = await TablesModule.getTableById(tableId);
        return table.length > 0;
    }

    async add(): Promise<any[]> {
        const { tableId } = this.req.body;
        TablesModule.updateLastEdit(tableId);
        return await super.add();
    }


}