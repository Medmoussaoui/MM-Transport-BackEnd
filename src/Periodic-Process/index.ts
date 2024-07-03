import { RemoveEmptyInvoices } from "./Function/Remove_Empty_invoices";
import { RemoveNotSavedInvoices } from "./Function/Remove_not_saved_invoices";
import { DropRequestIdsReferences } from "./Function/drop_request_uds_references";
import { RemoveTablesScheduleProcess } from "./Function/remove_tables";

export class AppScheduleFunctrions {
    removeEmptyInvoices() {
        new RemoveEmptyInvoices().run();
    }

    removeNotSavedInvoices() {
        new RemoveNotSavedInvoices().run();
    }

    removeUnVisibleTables() {
        new RemoveTablesScheduleProcess().run();
    }

    removeOldRequestReference() { 
        new DropRequestIdsReferences().run();
    }
}