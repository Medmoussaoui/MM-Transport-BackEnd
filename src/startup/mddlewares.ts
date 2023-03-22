import express, { Express } from "express";
import session from "express-session";
import { expressSessionOptions } from "../core/config/express_session_config";


export function middlewares(app: Express) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(session(expressSessionOptions));
}