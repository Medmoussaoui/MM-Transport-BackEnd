import { Request, Response } from "express";
import { getPageIndex } from "../../core/functions/get_page_index";
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

    getPage(): string {
        return this.req.header("page") ?? "0";
    }

    async getServices(): Promise<any[]> {
        const page = getPageIndex(20, this.getPage());
        return await ServicessModule.getServices(page);
    }
}