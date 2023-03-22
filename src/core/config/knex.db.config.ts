import config from "config";

import knex from "knex";

export const mysqldb = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'devpro2020',
        database: config.get('database')
    }
});