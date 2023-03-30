import { Request, Response } from "express";
import { TablesModule } from "../../../module/tables.model";

export class TransferTableServicesController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { serviceIds, from, to } = this.req.body;
        if (serviceIds == undefined) return false;
        if (from == undefined && from == "") return false;
        if (to == undefined && to == "") return false;
        if (!Array.isArray(serviceIds)) return false;
        return true;
    }

    invalidTableId() {
        this.res.status(400).send("Invalid Table Id");
    }

    async checkIfTableExist(): Promise<boolean> {
        const { to } = this.req.body;
        const table = await TablesModule.getTableById(to);
        return table.length > 0;
    }

    successTransferServices(): void {
        this.res.send("Services Transfered Success");
    }

    faildTransferServices(): void {
        this.res.status(400).send("Services Transfered Faild");
    }

    async transfer(): Promise<number> {
        const { body } = this.req;
        return await TablesModule.changeServicesTable(body);
    }

}
