import express, { Express } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth";
import { invoicesRoute } from "../Routes/Invoices";
import { servicesRoute } from "../Routes/Services";
import { tablesRoute } from "../Routes/Tables";

export function routes(app: Express) {
    // Welcome Route
    app.get('/', (req, res) => { res.send("Runing On Port 8000") });

    // Routes Shoud Authenticated
    app.use(isAuthenticated);
    app.use('/services', servicesRoute);
    
    // Routes Shoud Authorized
    app.use(isAuthorized);
    app.use('/tables', tablesRoute);
    app.use('/invoices', invoicesRoute);

}
