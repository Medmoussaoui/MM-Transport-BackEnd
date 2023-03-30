import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { AddServiceController } from "../services/add_service_controller";
import { AddServiceTableController } from "../Table/Services/Add_service";

export class AddServiceInvoiceController extends AddServiceTableController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        super(req, res)
        this.req = req;
        this.res = res;
    }


    verifyInput(): boolean {
        const { invoiceId, boatName } = this.req.body;
        if (invoiceId == undefined || invoiceId == "") return false;
        return super.verifyInput();
    }

    async checkTableId(): Promise<boolean> {
        const { invoiceId, tableId } = this.req.body;
        const invoiceInfo = await InvoiceModule.getInvoiceInfo(invoiceId);
        if (invoiceInfo.length > 0) return (invoiceInfo[0].tableId == tableId);
        return false;
    }

}