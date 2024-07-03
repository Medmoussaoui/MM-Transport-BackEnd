import { Request, Response } from 'express';
import { InvoiceModule } from '../../module/invoice.model';

export class ChangeInvoiceNameController {
  req: Request;
  res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  checkBodyInput(): boolean {
    if (this.req.body.invoiceName == undefined) return false;
    if (this.req.body.invoiceId == undefined) return false;
    return true;
  }

  async updateName(): Promise<number> {
    const { invoiceId, invoiceName } = this.req.body;
    return await InvoiceModule.updateInvoiceName(invoiceName, invoiceId);
  }
}