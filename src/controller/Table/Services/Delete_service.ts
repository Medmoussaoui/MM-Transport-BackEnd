import { Request, Response } from "express";
import { ServicessModule } from "../../../module/service.model";
import { TablesModule } from "../../../module/tables.model";
import { DeleteServiceController } from "../../services/delete_service_controller";

export class DeleteServiceTableController extends DeleteServiceController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { tableId } = this.req.body;
        if (tableId == undefined || tableId == "") return false;
        return super.checkBodyInput();
    }

    async delete(): Promise<void> {
        const { services, tableId } = this.req.body;
        await ServicessModule.delete(services);
        await TablesModule.updateLastEdit(tableId);
    }
}