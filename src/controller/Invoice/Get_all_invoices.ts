import { Request, Response } from "express";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { getPageIndex } from "../../core/functions/get_page_index";
import { TableInvoice } from "../../module/entity/invoice.entity";
import { InvoiceModule } from "../../module/invoice.model";

export class GetAllInvoiecsController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    convertToTableInvoice(rows: any[]): TableInvoice[] {
        let currentInvoiceId;
        let invoiceConverter: InvoiceConverter;
        const invoices: TableInvoice[] = [];

        for (let row of rows) {
            if (currentInvoiceId != row.invoiceId) {
                invoiceConverter = new InvoiceConverter([row]);
                invoices.push(invoiceConverter.invoice);
                currentInvoiceId = invoiceConverter.invoice.invoiceId;
            }
            invoiceConverter!.invoiceData = [row];
            invoiceConverter!.convert();
        }

        return invoices;
    }

    pageIndex(): number {
        const page = this.req.header("page");
        return getPageIndex(20, page)
    }

    async getInvoices(): Promise<any[]> {
        return await InvoiceModule.getInvoices(this.pageIndex());
    }

}
