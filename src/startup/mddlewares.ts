import express, { Express } from "express";
import { connectToRemoteSql } from "../core/config/knex.db.config";
import { syncReferenceMiddlewareController } from "../middlewares/sync_reference";
import { ImportantResponceMiddleware } from "../middlewares/important_responce_middlewaret";

export function middlewares(app: Express) {
    const syncReference = new syncReferenceMiddlewareController();
    const IRM = new ImportantResponceMiddleware();

    app.use(express.urlencoded({ extended: false }));

    app.use(express.json());
    app.use((req, res, next) => {
        connectToRemoteSql();
        next();
    });

    app.use(IRM.middleware());
    app.use(syncReference.middleware());
}