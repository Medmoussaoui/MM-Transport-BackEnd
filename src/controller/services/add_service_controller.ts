import { Request, Response } from "express";
import { ServicessModule } from "../../module/service.model";
import { TrucksModule } from "../../module/trcuks.model";
import { TablesModule } from "../../module/tables.model";
import { mysqldb } from "../../core/config/knex.db.config";
import { syncReferenceMiddlewareController } from "../../middlewares/sync_reference";

export class AddServiceController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.setDriverId();
    }

    invalidTruckId() {
        this.res.status(404).send("not truck found");
    }

    verifyInput() {
        const body = this.req.body;
        if (body.boatName == undefined) return false;
        if (body.serviceType == undefined) return false;
        if (body.price == undefined) return false;
        if (body.note == undefined) return false;
        if (body.dateCreate == undefined) return false;
        return true;
    }

    async checkTruckNumber(): Promise<boolean> {
        const { truckNumber, serviceType } = this.req.body;
        const noTruckId = (truckNumber == undefined) || truckNumber == "" || truckNumber == 0;
        const serviceIsPaye = (serviceType == "Paye");

        if (serviceIsPaye && noTruckId) return true;
        if (noTruckId) return false;

        const truck = await TrucksModule.getTruckById(truckNumber);
        if (truck.length > 0) {
            this.req.body.truckId = truck[0].truckId;
            return true;
        }
        return false;
    }

    setDriverId(): void {
        this.req.body.driverId = this.res.locals.user.driverId;
    }

    async updateTableLastEdit(): Promise<void> {
        const { tableId } = this.req.body;
        if (tableId != null && typeof tableId == "number") {
            await TablesModule.updateLastEdit(tableId);
        }
    }

    async add(): Promise<any[]> {
        const { body } = this.req;
        let service = await ServicessModule.addNewService(body);
        // -> SET sync reference
        syncReferenceMiddlewareController.setSyncReference(this.req, this.res);

        this.updateTableLastEdit();
        return await ServicessModule.getServiceById(service[0]);
    }


}

