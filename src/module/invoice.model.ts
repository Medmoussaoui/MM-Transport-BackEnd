import { mysqldb } from "../core/config/knex.db.config";

export class InvoiceModule {

    /// will return tableId of evry table has invoices
    ///
    static async getTablesHasInvoices(page: number): Promise<any[]> {
        return await mysqldb.distinct("tableId")
            .from("invoices_view")
            .limit(5).offset(page);
    }

    static async getNullTableInvoices() {
        return mysqldb.select("*").from("invoices_view").where({ tableId: null });
    }

    static async getInvoiceInfo(invoiceId: string): Promise<any[]> {
        return await mysqldb.select("*").from("invoice_info_view").where({ invoiceId });
    }

    static async saveInvoice(invoiceId: any): Promise<number> {
        return await mysqldb.update({ "save": "1" })
            .from('invoices')
            .where({ invoiceId });
    }

    static async getInvoiceById(invoiceId: string): Promise<any[]> {
        return mysqldb.select("*").from("invoices_view").where({ invoiceId });
    }

    static async markInvoicesUnVisible(invoiceIds: any[]): Promise<number> {
        return await mysqldb("invoices").update({ visible: 0 })
            .whereIn("invoiceId", invoiceIds).andWhere({ pay_status: "paid" });
    }

    static async deleteInvoices(invoiceIds: any[]): Promise<number> {
        return await mysqldb("invoices").delete()
            .whereIn("invoiceId", invoiceIds).andWhere({ pay_status: "unpaid" });
    }

    static async getInvoices(tableIds: any[]): Promise<any[]> {
        return mysqldb.select("*")
            .from("invoices_view")
            .whereIn("tableId", tableIds)
            .andWhere({ save: 1, visible: 1 });
    }

    static async getInvoicesByIds(invoiceIds: number[]): Promise<any[]> {
        return mysqldb.select("*")
            .from("invoices_view")
            .whereIn("invoiceId", invoiceIds)
            .andWhere({ save: 1, visible: 1 });
    }

    static async addService(invoiceId: string, serviceId: string): Promise<number[]> {
        return await mysqldb.insert({ serviceId, invoiceId }).into("invoice_serveses");
    }

    static async deleteServices(invoiceId: string, serviceIds: any[]): Promise<number> {
        return await mysqldb("invoice_serveses").del().whereIn("serviceId", serviceIds)
            .andWhere({ invoiceId })
    }

    static tableInvoices(tableId: string | number, invoiceIds: number[]): Promise<any[]> {
        return mysqldb.select("*")
            .from("invoices_view").whereIn("invoiceId", invoiceIds)
            .andWhere({ tableId, save: 1, visible: 1 });
    }

    static async getInvoiceByName(keyword: string, pageIndex: number): Promise<any[]> {
        return await mysqldb.select("*")
            .from("invoices_view")
            .whereLike("invoiceName", `%${keyword}%`).limit(10).offset(pageIndex);
    }

    static async updateInvoiceName(invoiceName: string, invoiceId: number): Promise<number> {
        return await mysqldb("invoices")
            .update({ "invoiceName": invoiceName })
            .where({ invoiceId });
    }

}