import { Request, Response } from "express";
import { AppResponce } from "../../core/constant/appResponce";
import { AddServiceController } from "./add_service_controller";
import { DeleteServiceController } from "./delete_service_controller";
import { EditServiceController } from "./edit_service";
import { GetServicesController } from "./get_services";

export class ServicesController {

    async getServices(req: Request, res: Response) {
        const controller = new GetServicesController(req, res);
        const services = await controller.getServices();
        res.send(services);
    }

    async addService(req: Request, res: Response) {
        const controller = new AddServiceController(req, res);

        if (!controller.verifyInput()) return controller.invalidServiceData();

        const validTruckId = await controller.checkTruckId();

        if (!validTruckId) return controller.invalidTruckId();

        await controller.add();
        res.status(201).send("Service Added");
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
        res.status(200).send("Delete Done");
    }
}