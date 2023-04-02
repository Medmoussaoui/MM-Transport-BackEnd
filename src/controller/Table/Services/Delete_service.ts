import { Request, Response } from "express";
import { TablesModule } from "../../../module/tables.model";
import { DeleteServiceController } from "../../services/delete_service_controller";

export class DeleteServiceTableController extends DeleteServiceController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { tableId } = this.req.body;
        if (tableId == undefined || tableId == "") return false;
        return super.checkBodyInput();
    }

    async delete(): Promise<number> {
        const { tableId } = this.req.body;
        TablesModule.updateLastEdit(tableId);
        return await super.delete();
    }
}