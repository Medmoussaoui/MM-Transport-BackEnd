import { Request, Response } from "express";
import { ServicessModule } from "../../module/service.model";

export class DeleteServiceController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    invalidBodyInput(): void {
        this.res.status(400).send('bad Request');
    }

    checkBodyInput(): boolean {
        const { body } = this.req;
        if (body.services == undefined) return false;
        if (!Array.isArray(body.services)) return false;
        if (body.services.length <= 0) return false;
        return true;
    }

    async delete(): Promise<number> {
        const { services } = this.req.body;
        return await ServicessModule.delete(services);
    }
}