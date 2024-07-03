import { Request, Response } from "express";
import { AppResponce } from "../../../core/constant/appResponce";
import { GetTableServicesController } from "./Get_service";
import { TransferTableServicesController } from "./Transfer_services";

export class TableServicesController {
    async getServices(req: Request, res: Response) {
        const controller = new GetTableServicesController(req, res);

        const noTableId = controller.checkIfNoTableId();
        if (noTableId) return controller.tableIdRequired();

        const services = await controller.getServices();
        res.send(services);
    }

    async transferServices(req: Request, res: Response) {
        const controller = new TransferTableServicesController(req, res);

        if (!controller.checkBodyInput()) return AppResponce.badRequest(res);

        const tableExist = await controller.checkIfTableExist();
        if (!tableExist) {
            return controller.invalidTableId();
        }

        await controller.transfer();
        return controller.successTransferServices();

    }
}