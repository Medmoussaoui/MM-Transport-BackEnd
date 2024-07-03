import { Request, Response } from "express";
import { mysqldb } from "../../core/config/knex.db.config";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { Invoice } from "../../module/entity/invoice.entity";

export class GetLinkedInvoicesController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    // InvoiceId
    with(): string {
        return this.req.params.invoiceId;
    }

    async getLinkedInvoiceIds(invoiceId: string) {
        const query = await mysqldb("invoices_view").distinct("invoiceId")
            .whereIn(
                "serviceId",
                mysqldb.select("serviceId").from("invoices_view").where({ invoiceId })
            );
        if (query.length >= 1) return query.map(e => e["invoiceId"]);
        return query;
    }

    async getInvoices(invoiceIds: number[]): Promise<any[]> {
        const query = await mysqldb("invoices_view").select("*").whereIn("invoiceId", invoiceIds);
        return this.convertQueryToInvoices(query);
    }

    convertQueryToInvoices(query: any[]): Invoice[] {
        let converter = new InvoiceConverter();
        const invoices: Invoice[] = [];

        for (let row of query) {
            if (row.invoiceId != converter.invoice.invoiceId) {
                converter = new InvoiceConverter();
                invoices.push(converter.invoice);
            }
            converter.insert(row);
        }

        return invoices;
    }
}