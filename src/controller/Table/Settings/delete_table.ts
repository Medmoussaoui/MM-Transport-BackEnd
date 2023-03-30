import { Request, Response } from "express";
import { TablesModule } from "../../../module/tables.model";

export class DeleteTableController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }


    successDeleteTable(): void {
        this.res.send("Delete Table Success");
    }

    faildDeleteTable(): void {
        this.res.status(400).send("Delete Table Faild");
    }

    async delete(): Promise<number> {
        const { tableId } = this.req.params;
        return await TablesModule.deleteTable(tableId);
    }

}