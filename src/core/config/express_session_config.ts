import session from "express-session";
import KnexSessionStore from 'connect-session-knex';
import { mysqldb } from './knex.db.config';

const knexSession = KnexSessionStore(session);
const store = new knexSession({ knex: mysqldb });

export const expressSessionOptions: session.SessionOptions = {
    name: "sessionToken",
    secret: "security secret top",
    cookie: {
        maxAge: 60000 * 60 * 24 * 30 * 12
    },
    store: store,
    saveUninitialized: false,
    rolling: true,
    resave: false
}