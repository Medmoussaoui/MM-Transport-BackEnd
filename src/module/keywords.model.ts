import { mysqldb } from "../core/config/knex.db.config";

export class KeywordsModule {
    static async boatNameMarchKeywords(keyword: string): Promise<any[]> {
        let asLower = keyword.toLowerCase();
        let matchKeywords = await mysqldb("services")
            .distinct("boatName")
            .whereRaw(`LOWER(boatName) LIKE ?`, [`%${asLower}%`]).limit(5)
        return matchKeywords;
    }

    static async serviceTypeMatchKeywords(keyword: string): Promise<any[]> {
        let asLower = keyword.toLowerCase();
        let matchKeywords = await mysqldb("services")
            .distinct("serviceType")
            .whereRaw(`LOWER(serviceType) LIKE ?`, [`%${asLower}%`]).limit(5)
        return matchKeywords;
    }
}