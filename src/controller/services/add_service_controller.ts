import { Request, Response } from "express";
import { ServicessModule } from "../../module/service.model";
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
        const serviceIsPaye = (serviceType == "Paye");

        if (serviceIsPaye && noTruckId) return true;
        if (noTruckId) return false;

        const truck = await TrucksModule.getTruckById(truckId);
        if (truck.length > 0) return true;
        return false;
    }

    setDriverId(): void {
        this.req.body.driverId = this.res.locals.user.driverId;
    }

    async add(): Promise<any[]> {
        const { body } = this.req;
        return await ServicessModule.addNewService(body);
    }
}