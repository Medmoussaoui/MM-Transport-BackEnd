import { mysqldb } from "../core/config/knex.db.config";

export class SmartTransferModule {

    async getDriverServices(driverId: any): Promise<any[]> {
        return await mysqldb("services")
            .distinct("boatName")
            .where({ driverId, tableId: null });
    }

    async getTablesAssociatedWithBoatName(boatName: string): Promise<any[]> {
        return await mysqldb("table_services_view")
            .distinct("tableId")
            .where({ boatName });
    }

    async transferServicesToTable(boatName: string, tableId: any): Promise<number> {
        /// update table id to [tableId] of all services that its boat name equals
        /// [BoatName], to make services associated with the specific table
        return await mysqldb.update({ tableId })
            .from("services")
            .where({ boatName, tableId: null });
    }
}