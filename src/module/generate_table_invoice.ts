import knex, { Knex } from "knex";
import { mysqldb } from "../core/config/knex.db.config";

export class GenerateTableInvoiceModule {
    tableId: number;
    invoiceName: string;

    constructor(tableId: number, invoiceName: string) {
        this.tableId = tableId;
        this.invoiceName = invoiceName;
    }


    async createInvoice(trx: Knex.Transaction) {
        return await mysqldb("invoices").insert({
            "tableId": this.tableId,
            "invoiceName": this.invoiceName,
        }, ["invoiceId"]).transacting(trx);
    }

    async getTableServices(trx: Knex.Transaction, invoiceId: number) {
        return await mysqldb("services_view")
            .select('serviceId', mysqldb.raw('? as invoiceId', invoiceId))
            .where({ "tableId": this.tableId, pay_from: null }).transacting(trx);
    }


    async addTableServiceToCurrentInvoice(trx: Knex.Transaction, services: any[]) {
        return await mysqldb.insert(services).into("invoice_serveses").transacting(trx);
    }

    async create() {
        let invoiceId = 0;
        await mysqldb.transaction(async trx => {
            const invoice = await this.createInvoice(trx);
            const services = await this.getTableServices(trx, invoice[0]);
            await this.addTableServiceToCurrentInvoice(trx, services);
            invoiceId = invoice[0];
        });
        return invoiceId;
    }
}