import { Request, Response } from "express";
import { TransferTableServicesController } from "../Table/Services/Transfer_services";

export class CustomTransferServicesController extends TransferTableServicesController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { serviceIds, from, to } = this.req.body;
        if (serviceIds == undefined) return false;
        if (from != null) return false;
        if (to == undefined && to == "") return false;
        if (!Array.isArray(serviceIds)) return false;
        return true;
    }
}