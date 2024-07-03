import { AppScheduleFunctrions } from "../Periodic-Process";
import * as config from "../startup/config";
import schedule from "node-schedule";

export function initialPeriodicFunctions() {
    const period = config.config.get("periodic-time");
    const functions = new AppScheduleFunctrions();

    schedule.scheduleJob("removeEmptyInvoices", period!, () => {
        functions.removeEmptyInvoices();
    });

    schedule.scheduleJob("removeNotSavedInvoices", period!, () => {
        functions.removeNotSavedInvoices();
    });

    schedule.scheduleJob("removeTables", period!, () => {
        functions.removeUnVisibleTables();
    });
}