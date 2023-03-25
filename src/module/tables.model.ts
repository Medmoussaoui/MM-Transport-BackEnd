import { mysqldb } from "../core/config/knex.db.config";

export class TablesModule {
    static async getTableById(tableId: string) {
        return await mysqldb("Tables").select("*").where({ tableId });
    }

    static async getTableName(tableName: string) {
        return await mysqldb("Tables").select("*").where({ tableName });
    }

    static async updateLastEdit(tableId: string) {
        const result = await mysqldb("Tables").update({ lastEdit: mysqldb.fn.now()}).where({ tableId });
        return result;
    }
}