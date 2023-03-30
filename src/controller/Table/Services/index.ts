import { Request, Response } from "express";
import { AppResponce } from "../../../core/constant/appResponce";
import { AddServiceTableController } from "./Add_service";
import { DeleteServiceTableController } from "./Delete_service";
import { EditTableServiceController } from "./Edit_service";
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

    async addService(req: Request, res: Response) {
        const controller = new AddServiceTableController(req, res);

        if (!controller.verifyInput()) return AppResponce.badRequest(res);

        const validTableId = await controller.checkTableId();
        const validTruckId = await controller.checkTruckId();

        if (!validTableId) return controller.invalidTableId();
        if (!validTruckId) return controller.invalidTruckId();

        controller.setDriverId();
        await controller.add();
        res.send("Service Added");
    }

    async editService(req: Request, res: Response) {
        const controller = new EditTableServiceController(req, res);

        if (!controller.checkBodyInput()) return AppResponce.badRequest(res);

        const service = await controller.getService();
        if (service.length <= 0) {
            return controller.invalidServiceId();
        }

        const isPayed = controller.isServicePayed(service[0]);
        if (isPayed) {
            return controller.canNotEditServicePayed();
        }

        await controller.update();
        res.status(200).send("service Updated");
    }

    async deleteServices(req: Request, res: Response) {
        const controller = new DeleteServiceTableController(req, res);
        
        if (!controller.checkBodyInput()) {
            return AppResponce.badRequest(res);
        }

        await controller.delete();
        res.send("Delete Done");
    }

    async transferServices(req: Request, res: Response) {
        const controller = new TransferTableServicesController(req, res);

        if (!controller.checkBodyInput()) return AppResponce.badRequest(res);

        const tableExist = await controller.checkIfTableExist();
        if (!tableExist) {
            return controller.invalidTableId();
        }

        const result = await controller.transfer();
        if (result > 0) {
            return controller.successTransferServices();
        }
        
        controller.faildTransferServices();
    }
}