import { Service } from "./services.entity";

export interface TableInvoice {
    invoiceId?: number,
    invoiceName?: string,
    tableId?: number,
    totalSummation?: number,
    totalPayingOff?: number,
    finalTotal?: number,
    pay_status?: string,
    dateCreate?: string,
    services?: Service[]
};
