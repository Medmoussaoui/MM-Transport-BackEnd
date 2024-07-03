import { Request, Response } from "express";
import { InvoiceModule } from "../../module/invoice.model";
import { TablesModule } from "../../module/tables.model";
import { Invoice } from "../../module/entity/invoice.entity";
import { convertToInvoice } from "../../core/functions/convert_to_invoice";
import { GenerateCustoInvoiceModel } from "../../module/generate_custom_invoice_model";

export class GenerateCustomInvoiceController {
    req: Request;
    res: Response

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    checkBodyInput(): boolean {
        const { serviceIds } = this.req.body;
        if (serviceIds == undefined) return false;
        if (!Array.isArray(serviceIds)) return false;
        if (serviceIds.length <= 0) return false;
        return true;
    }

    async getTableById(): Promise<any> {
        const query = await TablesModule.getTableById(this.getTableId());
        return query[0];
    }

    setInvoicName(tableName: string) {
        if (this.req.body.invoiceName == "") {
            return this.req.body.invoiceName = tableName;
        }
        if (this.req.body.invoiceName == null) {
            return this.req.body.invoiceName = tableName;
        }
    }

    invalidTableId(): void {
        this.res.status(400).send("Invalid Table Id");
    }

    getTableId(): number {
        return this.req.body.tableId;
    }

    async generateInoivce(): Promise<Invoice> {
        const { serviceIds, tableId, invoiceName } = this.req.body;
        const model = new GenerateCustoInvoiceModel(tableId, invoiceName, serviceIds);
        const invoiceId = await model.create();
        const invoice = await InvoiceModule.getInvoiceById(`${invoiceId}`);
        return convertToInvoice(invoice);
    }
}
