import { mysqldb } from "../core/config/knex.db.config";

export class TrucksModule {
    static async getTruckById(truckId: string) {
        return await mysqldb("Trucks").select("*").where({ truckId });
    }
}