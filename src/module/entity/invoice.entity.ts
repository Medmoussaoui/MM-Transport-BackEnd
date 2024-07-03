import { Service } from "./services.entity";


export interface Invoice {
    invoiceId?: number,
    tableId?: number,
    tableName?: string,
    invoiceName?: string,
    totalSummation?: number,
    totalPayingOff?: number,
    finalTotal?: number,
    pay_status?: string,
    dateCreate?: string,
    padiDate?: string,
    save?: number,
    inactive?: boolean,
    services?: Service[]
};

export interface TableInvoices {
    tableName?: string,
    tableId?: number,
    invoices: Invoice[],
};

