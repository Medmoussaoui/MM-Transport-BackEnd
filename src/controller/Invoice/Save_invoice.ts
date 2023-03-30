import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";


export class SaveInvoiceController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    getInvocieId(): string {
        return this.req.params.invoiceId;
    }

    noInvoiceFound(): void {
        this.res.status(404).send("No Invoice Found");
    }

    async save(): Promise<number> {
        return await InvoiceModule.saveInvoice(this.getInvocieId());
    }

}