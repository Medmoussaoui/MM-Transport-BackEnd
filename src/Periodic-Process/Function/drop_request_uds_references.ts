import { mysqldb } from "../../core/config/knex.db.config";

export class DropRequestIdsReferences {
    async clearOldRequests(): Promise<number> {
        return await mysqldb("requestreferences")
            .del().whereRaw("DATEDIFF(CURDATE(),requestDate) > ?", [15])
    }

    async run() {
        try {
            return await this.clearOldRequests();
        } catch (err) {
            return 0;
        }
    }
}