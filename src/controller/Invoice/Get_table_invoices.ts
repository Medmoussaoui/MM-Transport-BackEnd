import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { Invoice } from "../../module/entity/invoice.entity";
import { TableInvoicesConverter } from "../../core/class/invoice/table_invoices_converter";
import { getPageIndex } from "../../core/functions/get_page_index";
import { mysqldb } from "../../core/config/knex.db.config";

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

    convertToTableInvoices(rows: any[]): Invoice[] {
        const converter = new TableInvoicesConverter(rows);
        return converter.convert()[0].invoices;
    }

    getPage(): number {
        const page = this.req.header("page");
        return getPageIndex(10, page);
    }

    async getInvoiceIds(page: number): Promise<any[]> {
        return mysqldb.distinct("invoiceId").
            from("invoices_view")
            .where({ tableId: this.getTableId(), visible: 1, save: 1 })
            .limit(10).offset(page);
    }

    async getTableInvoices(invoiceIds: number[]): Promise<any[]> {
        return await InvoiceModule.tableInvoices(this.getTableId(), invoiceIds);
    }

}
