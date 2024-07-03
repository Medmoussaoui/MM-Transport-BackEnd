import { Invoice, TableInvoices } from "../../../module/entity/invoice.entity";
import { InvoiceConverter } from "./invoice_converter";

export class TableInvoicesConverter {

    rows: any[] = [];

    constructor(rows: any[]) {
        this.rows = rows;
    }

    tableInvoices: TableInvoices[] = [];

    invoiceConverter?: InvoiceConverter;

    getCurrentInvoice(): Invoice {
        const table = this.lastTableIndex();
        const lastInvoice = this.lastInvoiceIndex();
        return this.tableInvoices[table].invoices[lastInvoice];
    }

    createNewTable(row: any): void {
        this.tableInvoices?.push({
            tableId: row.tableId,
            tableName: row.tableName,
            invoices: [],
        });
    }

    createNewInvoice(row: any) {
        const table = this.lastTableIndex();
        this.invoiceConverter = new InvoiceConverter();
        this.invoiceConverter.initInvoiceInfo(row);
        this.tableInvoices[table].invoices.push(this.invoiceConverter.invoice);
    }


    lastTableIndex(): number {
        return this.tableInvoices.length - 1;
    }

    lastInvoiceIndex(): number {
        const table = this.lastTableIndex();
        return this.tableInvoices[table].invoices.length - 1;
    }

    isEqualCurrentInvoice(row: any): boolean {
        return this.invoiceConverter?.invoice.invoiceId == row.invoiceId;
    }

    isEqualCurrentTable(row: any): boolean {
        const index = this.lastTableIndex();
        return this.tableInvoices[index].tableId == row.tableId;
    }

    inserInvoiceItem(row: any): void {
        this.invoiceConverter!.insert(row);
    }

    convert(): TableInvoices[] {
        for (let row of this.rows) {
            if (this.tableInvoices.length <= 0) {
                this.createNewTable(row);
                this.createNewInvoice(row);
            }

            if (!this.isEqualCurrentTable(row)) {
                this.createNewTable(row);
            }

            if (!this.isEqualCurrentInvoice(row)) {
                this.createNewInvoice(row);
            }

            this.inserInvoiceItem(row);
        }
        return this.tableInvoices;
    }
}