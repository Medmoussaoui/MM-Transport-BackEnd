import { Request, Response } from "express";
import { InvoiceController } from ".";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { TableInvoice } from "../../module/entity/invoice.entity";
import { InvoiceModule } from "../../module/invoice.model";
import { TablesModule } from "../../module/tables.model";

export class GenerateTableInvoiceController {
    req: Request;
    res: Response

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    ifNoTableId(): boolean {
        const tableId = this.getTableId();
        if (tableId == undefined || tableId == "") return true;
        return false;
    }

    async verifyTableId(): Promise<boolean> {
        const table = await TablesModule.getTableById(this.getTableId());
        return table.length > 0;
    }

    invalidTableId(): void {
        this.res.status(400).send("Table Id is Required");
    }

    getTableId(): string {
        return this.req.header("tableId")!;
    }

    convertToTableInvoice(invoiceData: any[]): TableInvoice {
        return new InvoiceConverter(invoiceData).convert();
    }

    async generateInoivce(): Promise<TableInvoice> {
        const tableId = this.getTableId();
        const invoiceId = await InvoiceModule.newTableInvoice(tableId);
        const invoiceData = await InvoiceModule.getInvoiceById(invoiceId.toString());
        return this.convertToTableInvoice(invoiceData);
    }
}

