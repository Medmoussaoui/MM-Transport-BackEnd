import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { mysqldb } from "../../core/config/knex.db.config";
import { Knex } from "knex";

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
        return invoice.pay_status == "paid";
    }

    async deleteServices(trx: Knex.Transaction, serviceIds: any[], invoiceId: string) {
        return await mysqldb("invoice_serveses")
            .del().whereIn("serviceId", serviceIds)
            .andWhere({ invoiceId })
            .transacting(trx);
    }


    async markServicesUnPaid(trx: Knex.Transaction, serviceIds: any[]) {
        await mysqldb.update({ pay_from: null })
            .from("services")
            .whereIn("serviceId", serviceIds)
            .transacting(trx);
    }


    async delete(invoiceInfo: any): Promise<void> {
        const invoiceId = this.getInvoiceId();
        const serviceIds = this.getServiceIds();
        await mysqldb.transaction(async trx => {
            await this.deleteServices(trx, serviceIds, invoiceId);
            const isInvoicePayed = this.isInvoicePayed(invoiceInfo);
            if (isInvoicePayed) await this.markServicesUnPaid(trx, serviceIds);
        });
    }

}
