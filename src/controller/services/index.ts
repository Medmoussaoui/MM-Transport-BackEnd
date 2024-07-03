import { Request, Response } from "express";
import { AppResponce } from "../../core/constant/appResponce";
import { AddServiceController } from "./add_service_controller";
import { DeleteServiceController } from "./delete_service_controller";
import { EditServiceController } from "./edit_service";
import { GetServicesController } from "./get_services";
import { CustomTransferServicesController } from "./Custom_transfer_services";
import { SmartTransferServices } from "./Smart_transfer_services";
import { getDriverId } from "../../core/functions/get_driver_id";

export class ServicesController {

    async getServices(req: Request, res: Response) {
        const controller = new GetServicesController(req, res);
        const services = await controller.getServices();
        res.send(services);
    }

    async addService(req: Request, res: Response) {
        const controller = new AddServiceController(req, res);

        if (!controller.verifyInput()) return AppResponce.badRequest(res);

        const validTruckId = await controller.checkTruckNumber();

        if (!validTruckId) return controller.invalidTruckId();

        const service = await controller.add();
        res.status(201).send(service[0]);
    }

    async editService(req: Request, res: Response) {
        const controller = new EditServiceController(req, res);

        if (!controller.checkBodyInput()) return AppResponce.badRequest(res);

        const service = await controller.getService();
        if (service.length <= 0) {
            return controller.invalidServiceId();
        }

        let isValidTruck = await controller.checkTruckNumber();
        if (!isValidTruck) return controller.invalidTruckId();

        const update = await controller.update();

        res.status(200).send(update[0]);
    }


    async deleteService(req: Request, res: Response) {
        const controller = new DeleteServiceController(req, res);

        if (!controller.checkBodyInput()) {
            return controller.invalidBodyInput();
        }

        await controller.delete();
        res.send("Delete success");
    }

    async customTransferServices(req: Request, res: Response) {
        const controller = new CustomTransferServicesController(req, res);

        if (!controller.checkBodyInput()) return AppResponce.badRequest(res);

        const tableExist = await controller.checkIfTableExist();
        if (!tableExist) {
            return controller.invalidTableId();
        }

        await controller.transfer();
        return controller.successTransferServices();
    }

    async smartTransferServices(req: Request, res: Response) {
        const controller = new SmartTransferServices(req, res);
        const result =  await controller.start();
        res.send(result);
    }
}