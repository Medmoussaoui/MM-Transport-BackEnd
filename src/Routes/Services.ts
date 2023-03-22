import express from "express";

export const servicesRoute = express.Router();

servicesRoute.get("/", (req, res) => { });

servicesRoute.post("/new", (req, res) => { });

servicesRoute.put("/edit", (req, res) => { });

servicesRoute.delete("/delete", (req, res) => { });

/// https://www.api.transport/services/transfer/dsds454dq4s54ds5q4dq5s4
servicesRoute.post("/transfer/:tableId", (req, res) => { });