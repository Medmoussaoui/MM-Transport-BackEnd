import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";

export class InvoicePaymentController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { invoiceId, pay_status } = this.req.body;
        const payStatus = ["payed", "unpayed"];
        if (invoiceId == undefined || invoiceId == "") return false;
        if (pay_status == undefined || pay_status == "") return false;
        if (!payStatus.includes(pay_status)) return false;
        return true;
    }

    async getInvoice(): Promise<any[]> {
        const { invoiceId } = this.req.body;
        return await InvoiceModule.getInvoiceInfo(invoiceId);
    }

    isUnPayed(invoice: any): boolean {
        const { pay_status } = invoice;
        return pay_status == "unpayed" && this.req.body.pay_status == "payed";
    }

    payStatus(): string {
        return this.req.body.pay_status;
    }

    invoiceNotFound(): void {
        this.res.status(404).send("invoice Not Found");
    }

    payedSuccess(): void {
        this.res.send("Invoice Payed Success");
    }

    unPayedSuccess(): void {
        this.res.send("Invoice unPayed Success");
    }

    async payed(): Promise<void> {
        const { invoiceId } = this.req.body;
        const payedInvoice = InvoiceModule.setInvociePayed(invoiceId);
        const payedServices = InvoiceModule.setInvoiceServicePayed(invoiceId);
        await payedInvoice;
        await payedServices;
    }

    async unPayed(): Promise<void> {
        const { invoiceId } = this.req.body;
        const unPayedInvoice = InvoiceModule.setInvocieUnPayed(invoiceId);
        const unPayedServices = InvoiceModule.setInvoiceServiceUnpayed(invoiceId);
        await unPayedInvoice;
        await unPayedServices;
    }
}