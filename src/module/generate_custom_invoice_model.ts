import { Knex } from "knex";
import { mysqldb } from "../core/config/knex.db.config";

export class GenerateCustoInvoiceModel {
    tableId?: number;
    invoiceName: string;
    serviceIds: number[];

    constructor(tableId: number, invoiceName: string, serviceIds: number[]) {
        this.tableId = tableId;
        this.invoiceName = invoiceName;
        this.serviceIds = serviceIds;
    }

    async createInvoice(trx: Knex.Transaction) {
        return await mysqldb("invoices").insert({
            "tableId": this.tableId,
            "invoiceName": this.invoiceName,
        }, ["invoiceId"]).transacting(trx);
    }

    async getServices(trx: Knex.Transaction, invoiceId: number) {
        return await mysqldb("services_view")
            .select('serviceId', mysqldb.raw('? as invoiceId', invoiceId))
            .whereIn("serviceId", this.serviceIds)
            .transacting(trx);
    }


    async addCustomServiceToCurrentInvoice(trx: Knex.Transaction, services: any[]) {
        return await mysqldb.insert(services).into("invoice_serveses").transacting(trx);
    }

    async create() {
        let invoiceId = 0;
        await mysqldb.transaction(async trx => {
            const invoice = await this.createInvoice(trx);
            const services = await this.getServices(trx, invoice[0]);
            await this.addCustomServiceToCurrentInvoice(trx, services);
            invoiceId = invoice[0];
        });
        return invoiceId;
    }
}
