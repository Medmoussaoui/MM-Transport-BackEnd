import { Request, Response } from "express";
import { ServicessModule } from "../../../module/service.model";
import { TablesModule } from "../../../module/tables.model";
import { EditServiceController } from "../../services/edit_service";

export class EditTableServiceController extends EditServiceController {

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

    async update(): Promise<void> {
        const { body } = this.req;
        ServicessModule.update(body);         
        await TablesModule.updateLastEdit(body.tableId);
    }

}