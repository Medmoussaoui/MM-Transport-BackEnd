import { Invoice } from "../../module/entity/invoice.entity";
import { InvoiceConverter } from "../class/invoice/invoice_converter";

export function convertToInvoice(rows: any[]): Invoice {
    const converter = new InvoiceConverter();
    for (let row of rows) {
        converter.insert(row);
    }
    return converter.invoice;
}