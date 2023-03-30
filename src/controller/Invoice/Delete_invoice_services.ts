import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";

export class DeleteInvoicesServicesController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkInput(): boolean {
        const { serviceIds, invoiceId } = this.req.body;
        if (invoiceId == undefined || invoiceId == "") return false;
        if (serviceIds == undefined) return false;
        if (!Array.isArray(serviceIds)) return false;
        if (serviceIds.length <= 0) return false;
        return true;
    }

    canNotDeleteFromInvoicePayed(): void {
        this.res.status(400).send("Can Not Delete Or Update Service of Incoice Payed");
    }
    
    invoiceNotFound(): void {
        this.res.status(404).send("invoice Not Found");
    }

    getInvoiceId(): string {
        return this.req.body.invoiceId;
    }

    getServiceIds(): any[] {
        return this.req.body.serviceIds;
    }

    async getInvoiceInfo(): Promise<any[]> {
        return await InvoiceModule.getInvoiceInfo(this.getInvoiceId());
    }

    isInvoicePayed(invoice: any): boolean {
        return invoice.pay_status == "pay";
    }

    async delete(): Promise<number> {
        return await InvoiceModule.deleteServices(
            this.getInvoiceId(),
            this.getServiceIds(),
        );
    }

}