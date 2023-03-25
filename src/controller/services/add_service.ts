import { Request, Response } from "express";
import { mysqldb } from "../../core/config/knex.db.config";
import { setTableLastEdit } from "../../core/functions/update_table_last_edit";
import { ServicessModule } from "../../module/service.model";
import { TablesModule } from "../../module/tables.model";
import { TrucksModule } from "../../module/trcuks.model";

export class AddServiceController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.setDriverId();
    }

    invalidServiceData(): void {
        this.res.status(401).send("Invalid Service Data");
    }

    invalidTableId() {
        this.res.status(401).send("invalid table");
    }

    invalidTruckId() {
        this.res.status(401).send("invalid truck");
    }

    verifyInput() {
        const body = this.req.body;
        if (body.boatName == undefined) return false;
        if (body.serviceType == undefined) return false;
        if (body.price == undefined) return false;
        if (body.note == undefined) return false;
        return true;
    }

    async checkTruckId(): Promise<boolean> {
        const { truckId, serviceType } = this.req.body;
        const noTruckId = (truckId == undefined) || truckId == "" || truckId == 0;

        if (serviceType == "Paye" && noTruckId) return true;
        if (noTruckId) return false;

        const truck = await TrucksModule.getTruckById(truckId);
        if (truck.length > 0) return true;
        return false;
    }

    async checkTableId(): Promise<boolean> {
        const { tableId } = this.req.body;

        const noTableId = (!tableId) || tableId == "" || tableId == 0;
        if (noTableId) return true;

        const table = await TablesModule.getTableById(this.req.body.tableId);
        if (table.length > 0) return true;

        return false;
    }

    setDriverId(): void {
        this.req.body.driverId = this.res.locals.user.driverId;
    }

    async add() {
        const { body } = this.req;
        await ServicessModule.addNewService(body);
        await setTableLastEdit(body.tableId);
        this.res.status(201).send("Service Added");
    }
}