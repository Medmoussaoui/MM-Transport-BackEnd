import { Request, Response } from "express";
import { InvoiceController } from ".";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { TableInvoice } from "../../module/entity/invoice.entity";
import { InvoiceModule } from "../../module/invoice.model";
import { TablesModule } from "../../module/tables.model";

export class GenerateCustomInvoiceController {
    req: Request;
    res: Response

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { tableId, serviceIds } = this.req.body;
        if (tableId == undefined || tableId == "") return false;
        if (serviceIds == undefined) return false;
        if (!Array.isArray(serviceIds)) return false;
        if (serviceIds.length <= 0 ) return false;
        return true;
    }

    async verifyTableId(): Promise<boolean> {
        const table = await TablesModule.getTableById(this.getTableId());
        return table.length > 0;
    }

    invalidTableId(): void {
        this.res.status(400).send("Invalid Table Id");
    }

    getTableId(): string {
        return this.req.body.tableId;
    }

    convertToTableInvoice(invoiceData: any[]): TableInvoice {
        return new InvoiceConverter(invoiceData).convert();
    }

    async generateInoivce(): Promise<TableInvoice> {
        const tableId = this.getTableId();
        const { serviceIds } = this.req.body;
        const invoiceId = await InvoiceModule.newCustomInvoice(tableId, serviceIds);
        const invoice = await InvoiceModule.getInvoiceById(invoiceId.toString());
        return this.convertToTableInvoice(invoice);
    }
}

