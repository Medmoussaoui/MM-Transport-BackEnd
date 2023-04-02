import { mysqldb } from "../core/config/knex.db.config";
import { Service, TransferServices } from "./entity/services.entity";

export class TablesModule {

    static async getServices(tableId: string, page: number) {
        const offset = (page == 1) ? 1 : (page * 20);
        return await mysqldb("table_services_view")
            .select("*")
            .where({ tableId })
            .limit(20)
            .offset(offset);
    }

    static async getTableById(tableId: string): Promise<any[]> {
        return await mysqldb("Tables").select("*").where({ tableId });
    }

    static async updateLastEdit(tableId: any) {
        return await mysqldb("Tables")
            .update({ lastEdit: mysqldb.fn.now() })
            .where({ tableId});
    }

    static async updateTableName(newName: string, tableId: string): Promise<number> {
        return await mysqldb("Tables")
            .update({ tableName: newName })
            .where({ tableId });
    }

    static async deleteTable(tableId: string): Promise<number> {
        return await mysqldb("Tables").delete().where({ tableId });
    }

    static async getTables(page: number): Promise<any[]> {
        return await mysqldb("tables_info_view")
            .select("*")
            .limit(20)
            .offset(page);
    }

    static async createTable(tableName: string): Promise<any[]> {
        return await mysqldb("Tables").insert({ tableName }).returning("*");
    }

    static async changeServicesTable(services: TransferServices): Promise<number> {
        return await mysqldb("services")
            .update({ tableId: services.to })
            .whereIn("serviceId", services.serviceIds)
            .andWhere({ tableId: services.from });

    }
}