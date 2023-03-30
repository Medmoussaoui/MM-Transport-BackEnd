import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";

export class DeleteInvoicesController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { invoiceIds } = this.req.body;
        if (invoiceIds == undefined) return false;
        if (!Array.isArray(invoiceIds)) return false;
        if (invoiceIds.length <= 0) return false;
        return true;
    }

    getInvoiceIds(): any[] {
        return this.req.body.invoiceIds;
    }

    async delete(): Promise<number> {
        return await InvoiceModule.deleteInvoices(this.getInvoiceIds());
    }

}
