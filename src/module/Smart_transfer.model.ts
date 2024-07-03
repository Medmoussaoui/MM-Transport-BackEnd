import { mysqldb } from "../core/config/knex.db.config";
import { ServicessModule } from "./service.model";


type TransferToTableOptions = {
    driveId: number,
    tableId: number,
    boatName: string,
};


export class SmartTransferModule {

    async getDriverServices(driverId: any): Promise<any[]> {
        return await mysqldb("services")
            .distinct("boatName")
            .where({ driverId, tableId: null });
    }

    async getTablesAssociatedWithBoatName(boatName: string): Promise<any[]> {
        return await mysqldb(ServicessModule.ServicesView)
            .distinct("tableId")
            .where({ boatName }).andWhereNot({ tableId: null });
    }

    async transferServicesToTable(options: TransferToTableOptions): Promise<number> {
        /// update table id to [tableId] of all services that its boat name equals
        /// [BoatName], to make services associated with the specific table
        return await mysqldb.update({ "tableId": options.tableId })
            .from("services")
            .where({
                "boatName": options.boatName, "tableId": null,
                "driverId": options.driveId
            });
    }
}

function getTablesAssociatedWithBoatName() {
    mysqldb.select("tableId", "")
}

// karil - mohamed - simo
//  2        4         8


// SELECT (tableId -> changed), (tableName -> static) 