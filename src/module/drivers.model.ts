import { mysqldb } from "../core/config/knex.db.config";

export class DriversModule {

    static getDriverByUsername(username: string): Promise<any[]> {
        return mysqldb("drivers").select("*").where({ username });
    }

    static updatePassword(password: string, username: string): Promise<number> {
        return mysqldb("drivers").update({ password:password }).where({ username });
    }
}