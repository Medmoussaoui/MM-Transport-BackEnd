import knex, { Knex } from "knex";
import { config } from "../../startup/config";

export let mysqldb: Knex<any, unknown[]> = connectToRemoteSql();

export function connectToRemoteSql() {
    mysqldb = knex({
        client: 'mysql',
        connection: {
            host: config.get("db.host"),// "154.56.47.1",
            user: config.get("db.user"),// "u292568806_moussaoui50",
            password: config.get("db.password"), //"O6mQW5Eu7Hf?",
            database: config.get("db.database"),//"u292568806_mmtransport",
            port: 3306,
        },
    });
    return mysqldb;
}