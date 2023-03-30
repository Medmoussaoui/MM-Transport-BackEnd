import { Request, Response } from "express";
import { InvoiceModule } from "../../../module/invoice.model";
import { TablesModule } from "../../../module/tables.model";
import { TrucksModule } from "../../../module/trcuks.model";

export class AddServiceTableController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    invalidTruckId() {
        this.res.status(401).send("invalid truck");
    }

    invalidTableId() {
        this.res.status(401).send("invalid Table");
    }

    verifyInput() {
        const body = this.req.body;
        if (body.boatName == undefined) return false;
        if (body.serviceType == undefined) return false;
        if (body.price == undefined) return false;
        if (body.note == undefined) return false;
        if (body.tableId == undefined) return false;
        return true;
    }

    async checkTruckId(): Promise<boolean> {
        const { truckId, serviceType } = this.req.body;
        const noTruckId = (truckId == undefined) || truckId == "" || truckId == 0;
        const serviceIsPaye = (serviceType == "Paye");

        if (serviceIsPaye && noTruckId) return true;
        if (noTruckId) return false;

        const truck = await TrucksModule.getTruckById(truckId);
        if (truck.length > 0) return true;
        return false;
    }

    async checkTableId(): Promise<boolean> {
        const { tableId } = this.req.body;
        const table = await TablesModule.getTableById(tableId!);
        return table.length > 0;
    }

    setDriverId(): void {
        this.req.body.driverId = this.res.locals.user.driverId;
    }

    async add(): Promise<any[]> {
        const { body } = this.req;
        const serviceId = await TablesModule.addNewService(body);
        const lastEdit = TablesModule.updateLastEdit(body.tableId);
        const addService = InvoiceModule.addService(body.invoiceId, serviceId[0]);
        await lastEdit;
        return await addService;
    }
}