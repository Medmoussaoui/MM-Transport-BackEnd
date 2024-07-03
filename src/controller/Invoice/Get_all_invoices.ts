import { Request, Response } from "express";
import { getPageIndex } from "../../core/functions/get_page_index";
import { InvoiceModule } from "../../module/invoice.model";
import { TableInvoices } from "../../module/entity/invoice.entity";
import { TableInvoicesConverter } from "../../core/class/invoice/table_invoices_converter";
import { mysqldb } from "../../core/config/knex.db.config";

export class GetAllInvoiecsController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    pageIndex(): number {
        const page = this.req.header("page")
        if (page == undefined) return 0;
        return parseInt(page);
    }

    async getInvoicesWithNoTable(): Promise<any[]> {
        return mysqldb.select("*")
            .from("invoices_view")
            .where({ tableId: null, visible: 1, save: 1 });
    }

    async getTableIds(page: number) {
        const offset = getPageIndex(5, `${page}`);
        const query = await InvoiceModule.getTablesHasInvoices(offset);
        if (query.length >= 1) {
            return query.map(item => item["tableId"]);
        }
        return [];
    }

    convertToTableInvoices(rows: any[]): TableInvoices[] {
        const converter = new TableInvoicesConverter(rows);
        return converter.convert();
    }

    async getInvoices(tableIds: any[]): Promise<any[]> {
        return await InvoiceModule.getInvoices(tableIds);
    }

}
