import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { TablesModule } from "../../module/tables.model";
import { Invoice } from "../../module/entity/invoice.entity";
import { convertToInvoice } from "../../core/functions/convert_to_invoice";
import { mysqldb } from "../../core/config/knex.db.config";
import { GenerateTableInvoiceModule } from "../../module/generate_table_invoice";

export class GenerateTableInvoiceController {
    req: Request;
    res: Response

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    ifNoTableId(): boolean {
        const tableId = this.getTableId();
        if (tableId == undefined || tableId == 0) return true;
        return false;
    }

    hasService(tableInfo: any): boolean {
        return tableInfo["totalUnpaidServices"] >= 1;
    }

    setInvoicName(tableName: string) {
        this.req.body.invoiceName = this.req.body.invoiceName ?? tableName;
    }

    async getTableById(): Promise<any> {
        if (this.getTableId() == null) return true;
        const query = await TablesModule.getTableById(this.getTableId());
        return query[0];
    }

    invalidTableId(): void {
        this.res.status(400).send("Table Id is Required");
    }

    noTableFound(): void {
        this.res.status(400).send("no Table Found");
    }

    getTableId(): number {
        return this.req.body.tableId;
    }

    async generateInoivce(): Promise<Invoice> {
        const { tableId, invoiceName } = this.req.body;
        const model = new GenerateTableInvoiceModule(tableId, invoiceName);
        const invoiceId = await model.create();
        const invoiceData = await InvoiceModule.getInvoiceById(invoiceId.toString());
        return convertToInvoice(invoiceData);
    }
}

