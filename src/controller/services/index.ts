import { Request, Response } from "express";
import { AddServiceController } from "./add_service";
import { DeleteServiceController } from "./delete_service_controller";
import { EditServiceController } from "./edit_service";

export class ServicesController {
    async add(req: Request, res: Response) {
        const controller = new AddServiceController(req, res);

        if (!controller.verifyInput()) return controller.invalidServiceData();

        const validTruckId = await controller.checkTruckId();
        const validtableId = await controller.checkTableId();

        if (!validTruckId) return controller.invalidTruckId();
        if (!validtableId) return controller.invalidTableId();

        await controller.add();
    }

    async edit(req: Request, res: Response) {
        const controller = new EditServiceController(req, res);
       
        if (!controller.checkBodyInput()) return controller.invalidBodyInput();

        const validServiceId = await controller.checkServiceId();
        if (!validServiceId) return controller.invalidServiceId();

        await controller.update();
    }


    async delete(req: Request, res: Response) {
        const controller = new DeleteServiceController(req, res);
        if(!controller.checkBodyInput()) return controller.invalidBodyInput();
        controller.delete();
    }




}