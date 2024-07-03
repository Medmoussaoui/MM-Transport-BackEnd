import { mysqldb } from "../core/config/knex.db.config";

export class TrucksModule {
    static async getTruckById(truckNumber: string) {
        return await mysqldb("trucks").select("*").where({ truckNumber });
    }

    static async getTrucks() {
        return await mysqldb("trucks_view").select("*");
    }
}