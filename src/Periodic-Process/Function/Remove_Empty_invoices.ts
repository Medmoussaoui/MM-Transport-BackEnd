import { mysqldb } from "../../core/config/knex.db.config";

export class RemoveEmptyInvoices {

    private async remove(): Promise<number> {
        return await mysqldb("invoices").delete().whereNotIn(
            "invoiceId", mysqldb.select("invoiceId").from("invoice_serveses")
        );
    }

    async run(): Promise<number> {
        try {
            return this.remove();
        } catch (err) {
            return 0;
        }
    }
}