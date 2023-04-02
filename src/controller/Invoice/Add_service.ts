import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
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
        const { invoiceId } = this.req.body;
        if (invoiceId == undefined || invoiceId == "") return false;
        return super.verifyInput();
    }

    setTableId(invoiceInfo: any): void {
        this.req.body.tableId = invoiceInfo.tableId;
    }

    async getInvoiceInfo(): Promise<any[]> {
        const { invoiceId } = this.req.body;
        return await InvoiceModule.getInvoiceInfo(invoiceId);
    }

    checkIfInvoiceIsPayed(invoiceInfo: any): boolean {
        return invoiceInfo.pay_status == "payed";
    }

    canNotDeleteOrUpdateService(): void {
        this.res.status(400).send("Can Not Delete Or Update Service of Incoice Payed");
    }

    async add(): Promise<any[]> {
        const service = await super.add();
        const serviceId = service[0];
        await InvoiceModule.addService(this.req.body.invoiceId, serviceId);
        return service;
    }

}