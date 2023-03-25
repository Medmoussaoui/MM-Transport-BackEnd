import express, { Express } from "express";

export function middlewares(app: Express) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
}