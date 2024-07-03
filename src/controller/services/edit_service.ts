import { Request, Response } from "express";
import { ServicessModule } from "../../module/service.model";
import { TrucksModule } from "../../module/trcuks.model";

export class EditServiceController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }


    invalidServiceId(): void {
        this.res.status(400).send('Invalid Service Id');
    }

    checkBodyInput(): boolean {
        const { body } = this.req;
        if (body.serviceId == undefined) return false;
        if (body.boatName == undefined) return false;
        if (body.serviceType == undefined) return false;
        if (body.price == undefined) return false;
        if (body.dateCreate == undefined) return false;
        if (body.truckNumber == undefined) return false;
        return true;
    }

    invalidTruckId() {
        this.res.status(401).send("invalid truck");
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

    async getService(): Promise<any[]> {
        const { serviceId } = this.req.body;
        return await ServicessModule.getServiceById(serviceId);
    }


    async update(): Promise<any[]> {
        const { body } = this.req;
        await ServicessModule.update(body);
        return await ServicessModule.getServiceById(body.serviceId);
    }

}