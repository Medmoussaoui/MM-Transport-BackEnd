import { mysqldb } from "../core/config/knex.db.config";

export class InvoiceModule {

    static async getInvoiceInfo(invoiceId: string): Promise<any[]> {
        return await mysqldb.select("*").from("invoices").where({ invoiceId });
    }

    static async createInvoice(tableId: string): Promise<number> {
        return await mysqldb("invoices").insert({
            tableId,
            invoiceName: mysqldb.select("tableName as invoiceName")
                .from("tables")
                .where({ tableId })
        }, ["invoiceId"]);
    }

    static async saveInvoice(invoiceId: any):Promise<number> {
        return await mysqldb.update({ save: 1 })
        .from('invoices')
        .where({invoiceId});
    }
    static async getInvoiceById(invoiceId: string): Promise<any[]> {
        return mysqldb.select("*").from("invoice_services_view").where({ invoiceId });
    }

    static async deleteInvoices(invoiceIds: any[]): Promise<number> {
        return await mysqldb("invoices").delete().whereIn("invoiceId", invoiceIds);
    }

    static async getInvoices(page: number): Promise<any[]> {
        return mysqldb.select("*")
            .from("invoice_services_view")
            .limit(20).offset(page);
    }

    static async newTableInvoice(tableId: string): Promise<number> {
        // this methode create new invoice and link all 
        // table service with the current invoice created And 
        // will be returning the [invoice Id]
        const invoiceId = await this.createInvoice(tableId);

        const tableServices = await mysqldb("table_services_view")
            .select('serviceId', mysqldb.raw('? as invoiceId', invoiceId))
            .where({ tableId })

        await mysqldb.insert(tableServices).into("invoice_serveses");
        return invoiceId;
    }

    static async newCustomInvoice(tableId: string, serviceIds: string[]): Promise<number> {
        // this methode create new invoice and link Custom 
        // table service with the current invoice created And 
        // will be returning the [invoice Id]
        const invoiceId = await this.createInvoice(tableId);

        const tableServices = await mysqldb("table_services_view")
            .select('serviceId', mysqldb.raw('? as invoiceId', invoiceId))
            .where({ tableId }).whereIn("serviceId", serviceIds);

        await mysqldb.insert(tableServices).into("invoice_serveses");
        return invoiceId;
    }

    static async addService(invoiceId: string, serviceId: string): Promise<number[]> {
        return await mysqldb.insert({ serviceId, invoiceId }).into("invoice_serveses");
    }

    static async deleteServices(invoiceId: string, serviceIds: any[]): Promise<number> {
        return await mysqldb.delete().from('invoice_serveses')
            .whereIn("serviceId", serviceIds)
            .andWhere({ invoiceId })
    }

    static tableInvoices(tableId: string | number): Promise<any[]> {
        return mysqldb.select("*").from("invoice_services_view").where({ tableId });
    }

    static async setInvociePayed(invoiceId: string): Promise<number> {
        return await mysqldb.update({ pay_status: "payed" })
            .from("invoices")
            .where({ invoiceId });
    }

    static async setInvocieUnPayed(invoiceId: string): Promise<number> {
        return await mysqldb.update({ pay_status: "unpayed" })
            .from("invoices")
            .where({ invoiceId });
    }


    static async setInvoiceServicePayed(invoiceId: string): Promise<number> {
        return await mysqldb("services").update({ pay_from: invoiceId })
            .whereNull("pay_from")
            .andWhere(
                "serviceId",
                "in",
                mysqldb.select("serviceId").from("invoice_serveses").where({ invoiceId })
            );
    }

    static async setInvoiceServiceUnpayed(invoiceId: string): Promise<number> {
        return await mysqldb("services").update({ pay_from: null })
            .whereRaw('pay_from = ?', [invoiceId]);
    }

}