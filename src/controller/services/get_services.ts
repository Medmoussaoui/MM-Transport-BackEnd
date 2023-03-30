import { Request, Response } from "express";
import { ServicessModule } from "../../module/service.model";

export class GetServicesController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    getDriverId(): string {
        return this.res.locals.user.driverId;
    }

    getPageIndex(): number {
        let page = this.req.header("page");
        if (page == undefined || page == "1") return 0;
        return parseInt(page) * 20;
    }

    async getServices(): Promise<any[]> {
        const driverId = this.getDriverId();
        const page = this.getPageIndex();
        return await ServicessModule.getServices(driverId, page);
    }
}