import express from "express";

export const tablesRoute = express.Router();

tablesRoute.get("/info", (req, res) => { });

tablesRoute.get("/services", (req, res) => { });

tablesRoute.post("/newtable", (req, res) => { });

tablesRoute.put("/rename", (req, res) => { });

tablesRoute.delete("/delete", (req, res) => { });