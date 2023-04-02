import { Request, Response } from "express";
import { TablesModule } from "../../module/tables.model";

class DeleteTableController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    getTableId(): any {
        return this.req.params.tableId;
    }

    async delete(): Promise<any> {
        return await TablesModule.deleteTable(this.getTableId());
    }
}