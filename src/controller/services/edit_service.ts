import { Request, Response } from "express";
import { setTableLastEdit } from "../../core/functions/update_table_last_edit";
import { ServicessModule } from "../../module/service.model";

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

    invalidBodyInput(): void {
        this.res.status(400).send('bad Request');
    }

    checkBodyInput(): boolean {
        const { body } = this.req;
        if (body.serviceId == undefined) return false;
        if (body.boatName == undefined) return false;
        if (body.serviceType == undefined) return false;
        if (body.price == undefined) return false;
        if (body.date == undefined) return false;
        return true;
    }

    async checkServiceId(): Promise<boolean> {
        const service = await ServicessModule.getServiceById(this.req.body.serviceId);
        if (service.length > 0) return true;
        return false;
    }

    async update() {
        const { body } = this.req;
        await ServicessModule.update(body);
        await setTableLastEdit(body.tableId);
        this.res.status(200).send("service Updated");
    }

}