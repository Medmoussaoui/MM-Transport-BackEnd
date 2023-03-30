import { Request, Response } from "express";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { TableInvoice } from "../../module/entity/invoice.entity";
import { InvoiceModule } from "../../module/invoice.model";

export class GetTableInvoicesController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    getTableId(): string {
        return this.req.params.tableId;
    }

    convertToTableInvoice(rows: any[]): TableInvoice[] {
        let currentInvoiceId;
        let invoiceConverter: InvoiceConverter;
        const tableInvoices: TableInvoice[] = [];

        for (let row of rows) {
            if (currentInvoiceId != row.invoiceId) {
                invoiceConverter = new InvoiceConverter([row]);
                tableInvoices.push(invoiceConverter.invoice);
                currentInvoiceId = invoiceConverter.invoice.invoiceId;
            }
            invoiceConverter!.invoiceData = [row];
            invoiceConverter!.convert();
        }

        return tableInvoices;
    }

    async getTableInvoices(): Promise<any[]> {
        return await InvoiceModule.tableInvoices(this.getTableId());
    }

}
