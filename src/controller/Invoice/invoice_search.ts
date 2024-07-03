import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { Invoice } from "../../module/entity/invoice.entity";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { getPageIndex } from "../../core/functions/get_page_index";
import { mysqldb } from "../../core/config/knex.db.config";

export class InvoiceSearchController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    pageIndex(): number {
        const page = this.req.header("pageIndex");
        return getPageIndex(10, page);
    }

    getInvoiceKeyword(): string {
        return this.req.params.keyword;
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

    async getInvoiceIdsByMatchKeyword(): Promise<any[]> {
        const keyword = this.getInvoiceKeyword();
        const pageIndex = this.pageIndex();
        return await mysqldb.distinct("invoiceId")
            .from("invoices_view")
            .where("invoiceName", "like", `%${keyword}%`)
            .andWhere({ visible: 1, save: 1 })
            .limit(10).offset(pageIndex);
    }

    async getInvoicesByIds(invoiceIds: number[]): Promise<any[]> {
        return InvoiceModule.getInvoicesByIds(invoiceIds);
    }

}