import { Request, Response } from "express";
import { mysqldb } from "../../core/config/knex.db.config";
import { Knex } from "knex";

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

    async delete(): Promise<void> {
        const { invoiceIds } = this.req.body;
        await mysqldb.transaction(async trx => {
            await this.markPaidInvoicesUnVisible(trx, invoiceIds);
            await this.removeUnPaidInvoices(trx, invoiceIds);
        });
    }


    async markPaidInvoicesUnVisible(trx: Knex.Transaction, invoiceIds: any[]) {
        return await mysqldb("invoices").update({ visible: 0 })
            .whereIn("invoiceId", invoiceIds)
            .andWhere({ pay_status: "paid" }).transacting(trx);
    }

    async removeUnPaidInvoices(trx: Knex.Transaction, invoiceIds: any[]) {
        return await mysqldb("invoices").delete()
            .whereIn("invoiceId", invoiceIds).andWhere({ pay_status: "unpaid" })
            .transacting(trx);
    }

}




