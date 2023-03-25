import config from "config";

import knex from "knex";

export const mysqldb = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: config.get('database')
    }
});