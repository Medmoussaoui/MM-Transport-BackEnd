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

    invoiceAreadyPaid(): void {
        this.res.status(400).send("The invoice is already Paid");
    }

    invoiceAreadyUnPaid(): void {
        this.res.status(400).send("The invoice is already unPaid");
    }

    hasConflict(invoice: any): boolean {
        const isInvoicePaid = invoice.pay_from == "paid";
        const action = this.payStatus();

        if (isInvoicePaid && action == "paid") {
            this.invoiceAreadyPaid();
            return true;
        }

        if (!isInvoicePaid && action == "unpaid") {
            this.invoiceAreadyUnPaid();
            return true;
        }
        return false;
    }

    payStatus(): any {
        return this.req.body.pay_status;
    }

    invoiceNotFound(): void {
        this.res.status(404).send("invoice Not Found");
    }

    paidSuccess(): void {
        this.res.send("Invoice Payed Success");
    }

    unPaidSuccess(): void {
        this.res.send("Invoice unPayed Success");
    }

    async paid(): Promise<void> {
        const { invoiceId } = this.req.body;
        const payedInvoice = InvoiceModule.setInvociePaid(invoiceId);
        const payedServices = InvoiceModule.setInvoiceServicePaid(invoiceId);
        await payedInvoice;
        await payedServices;
    }

    async unPaid(): Promise<void> {
        const { invoiceId } = this.req.body;
        const unPayedInvoice = InvoiceModule.setInvocieUnPaid(invoiceId);
        const unPayedServices = InvoiceModule.setInvoiceServiceUnpaid(invoiceId);
        await unPayedInvoice;
        await unPayedServices;
    }
}