import { Request, Response } from "express";
import { ServicessModule } from "../../module/service.model";

export class EditServiceController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    canNotEditServicePayed(): void {
        this.res.status(400).send("Can not edit Service payed");
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
        return true;
    }

    async getService(): Promise<any[]> {
        const { serviceId } = this.req.body;
        return await ServicessModule.getServiceById(serviceId);
    }

    isServicePayed(service: any): boolean {
        const { pay_status } = service;
        return pay_status == "pay";
    }

    async update(): Promise<any[]> {
        const { body } = this.req;
        return await ServicessModule.update(body);
    }

}