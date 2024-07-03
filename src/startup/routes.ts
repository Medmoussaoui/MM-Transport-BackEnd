import { Express } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth";
import { accountRoute } from "../Routes/account";
import { invoicesRoute } from "../Routes/Invoices";
import { servicesRoute } from "../Routes/Services";
import { tablesRoute } from "../Routes/Tables";
import { trucksRoute } from "../Routes/trucks";
import { keywordsRoute } from "../Routes/keywords";
import { ImportantResponceModel } from "../module/important_responce_model";

export function routes(app: Express) {
    // Welcome Route
    app.get('/', (req, res) => { res.send("Welcome Into MM-Transport") });

    app.use('/account', accountRoute);
    app.use('/trucks', trucksRoute);

    // Routes Shoud Authenticated
    app.use(isAuthenticated);

    app.get('/responceback', async (req, res) => {
        const request_id = req.header("request_id");
        let responce = await ImportantResponceModel.getReponce(request_id ?? "");
        if (responce == undefined) {
            return res.status(404).send("no responce to back");
        }
        return res.send(responce);
    });

    app.use('/services', servicesRoute);
    app.use('/keywords', isAuthorized, keywordsRoute);

    // Routes Shoud Authorized
    app.use('/tables', tablesRoute);
    app.use('/invoices', isAuthorized, invoicesRoute);

}
