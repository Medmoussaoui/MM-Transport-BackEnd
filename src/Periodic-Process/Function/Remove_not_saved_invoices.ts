import { mysqldb } from "../../core/config/knex.db.config";

export class RemoveNotSavedInvoices {

    async delete(): Promise<number> {
        return await mysqldb("invoices").delete().where({ "save": 0 })
    }

    async run(): Promise<number> {
        try {
            return await this.delete();
        } catch (err) {
            return 0;
        }
    }
} 