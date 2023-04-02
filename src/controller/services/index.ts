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

        const validTruckId = await controller.checkTruckId();

        if (!validTruckId) return controller.invalidTruckId();

        const service = await controller.add();
        res.status(201).send(service);
    }

    async editService(req: Request, res: Response) {
        const controller = new EditServiceController(req, res);

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

        const result = await controller.transfer();
        if (result > 0) {
            return controller.successTransferServices();
        }

        controller.faildTransferServices();
    }

    async smartTransferServices(req: Request, res: Response) {
        const controller = new SmartTransferServices(req, res);
        const driverId = getDriverId(res);
        const services = await controller.db.getDriverServices(driverId);

        if (services.length <= 0) {
            return res.status(404).send("No Services Found To Transfer");
        }

        const result = await controller.transfer(services);
        res.status(controller.statusCode()).send(result);
    }
}