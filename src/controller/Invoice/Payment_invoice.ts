import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { convertToInvoice } from "../../core/functions/convert_to_invoice";
import { mysqldb } from "../../core/config/knex.db.config";
import { Knex } from "knex";

export class InvoicePaymentController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { invoiceId, pay_status } = this.req.body;
        const payStatus = ["paid", "unpaid"];
        if (invoiceId == undefined || invoiceId == "") return false;
        if (pay_status == undefined || pay_status == "") return false;
        if (!payStatus.includes(pay_status)) return false;
        return true;
    }

    async getInvoice(): Promise<any[]> {
        const { invoiceId } = this.req.body;
        return await InvoiceModule.getInvoiceInfo(invoiceId);
    }


    payStatus(): any {
        return this.req.body.pay_status;
    }

    invoiceNotFound(): void {
        this.res.status(404).send("invoice Not Found");
    }

    async refrechInvoice() {
        const { invoiceId } = this.req.body;
        const rows = await InvoiceModule.getInvoiceById(invoiceId);
        if (rows.length <= 0) return this.res.status(404).send("No Invoice Found");
        const invoice = convertToInvoice(rows);
        return this.res.send(invoice);
    }

    isInactiveInvoice(invoice: any): boolean {
        return invoice.totalServices == invoice.inactiveServices;
    }

    async payInvoice(): Promise<void> {
        const { invoiceId } = this.req.body;
        return await new PayInvoiceModel(invoiceId).pay();
    }

    async cancelPayment(): Promise<void> {
        const { invoiceId } = this.req.body;
        return await new CancelInvocePaymentModel(invoiceId).cancel();
    }
}

export class PayInvoiceModel {

    invoiceId: number;

    constructor(invoiceId: number) {
        this.invoiceId = invoiceId;
    }

    private async markInvoiceServicePaid(trx: Knex.Transaction, serviceIds: any[]) {
        return await mysqldb("services").update({ pay_from: this.invoiceId })
            .whereNull("pay_from").andWhere(
                "serviceId",
                "in",
                mysqldb.select("serviceId")
                    .from("invoice_serveses")
                    .where({ "invoiceId": this.invoiceId }),
            ).transacting(trx);
    }

    private async markInvoicePaid(trx: Knex.Transaction) {
        return await mysqldb.update({
            pay_status: "paid",
            paid_date: mysqldb.fn.now(),
            save: 1,
        }).from("invoices").where({ "invoiceId": this.invoiceId }).transacting(trx);
    }

    async pay() {
        await mysqldb.transaction(async trx => {
            await this.markInvoicePaid(trx);
            await this.markInvoiceServicePaid(trx, []);
        });
    }
}


export class CancelInvocePaymentModel {

    invoiceId: number;

    constructor(invoiceId: number) {
        this.invoiceId = invoiceId;
    }

    private async markInvoiceServiceUnPaid(trx: Knex.Transaction) {
        return mysqldb("services")
            .update({ pay_from: null }).where({ pay_from: this.invoiceId })
            .transacting(trx);
    }

    private async markInvoiceUnPaid(trx: Knex.Transaction) {
        const invoiceId = this.invoiceId;
        return await mysqldb.update({
            pay_status: "unpaid",
            paid_date: null,
            save: 1,
        }).from("invoices").where({ invoiceId }).transacting(trx);
    }

    async cancel() {
        await mysqldb.transaction(async trx => {
            await this.markInvoiceUnPaid(trx);
            await this.markInvoiceServiceUnPaid(trx);
        });
    }
}