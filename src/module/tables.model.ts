import { mysqldb } from "../core/config/knex.db.config";
import { TransferServices } from "./entity/services.entity";
import { ServicessModule } from "./service.model";

export class TablesModule {

    static tablesInfoView: string = "tables_info_view";

    static async getServices(tableId: string, page: number) {
        const offset = (page == 1) ? 1 : (page * 20);
        return await mysqldb(ServicessModule.ServicesView)
            .select("*")
            .where({ tableId, pay_from: null })
        //.limit(20)
        //.offset(offset);
    }

    static async getTableById(tableId: number): Promise<any[]> {
        return await mysqldb(TablesModule.tablesInfoView)
            .select("*")
            .where({ tableId });
    }

    static async updateLastEdit(tableId: any) {
        return await mysqldb("tables")
            .update({ lastEdit: mysqldb.fn.now() })
            .where({ tableId });
    }

    static async updateTableName(newName: string, tableId: string): Promise<number> {
        return await mysqldb("tables")
            .update({ tableName: newName, lastEdit: mysqldb.fn.now() })
            .where({ tableId });
    }

    static async deleteTable(tableId: string): Promise<number> {
        return await mysqldb("tables").delete().where({ tableId });
    }

    static async getTables(page: number): Promise<any[]> {
        return await mysqldb(TablesModule.tablesInfoView).select("*").where({ visible: 1 })
        //.limit(20)
        //.offset(page);
    }

    static async getTableName(tableId: number | string): Promise<string | null> {
        const query = await mysqldb.select("tableName")
            .from("tables")
            .where({ tableId });
        if (query.length > 0) return query[0]["tableName"];
        return null;
    }

    static async createTable(tableName: string): Promise<any[]> {
        return await mysqldb("tables").insert({ tableName }).returning("*");
    }

    static async changeServicesTable(services: TransferServices): Promise<number> {
        return await mysqldb("services")
            .update({ tableId: services.to })
            .whereIn("serviceId", services.serviceIds);
    }
}