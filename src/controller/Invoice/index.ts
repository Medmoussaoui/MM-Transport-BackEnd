import { Request, Response } from "express";
import { InvoiceConverter } from "../../core/class/invoice/invoice_converter";
import { AppResponce } from "../../core/constant/appResponce";
import { InvoiceModule } from "../../module/invoice.model";
import { AddServiceInvoiceController } from "./Add_service";
import { DeleteInvoicesController } from "./Delete_invoices";
import { DeleteInvoicesServicesController } from "./Delete_invoice_services";
import { GenerateCustomInvoiceController } from "./Generate_custom_invoice";
import { GenerateTableInvoiceController } from "./Generate_table_invoice";
import { GetAllInvoiecsController } from "./Get_all_invoices";
import { GetTableInvoicesController } from "./Get_table_invoices";
import { InvoicePaymentController } from "./Payment_invoice";
import { SaveInvoiceController } from "./Save_invoice";

export class InvoiceController {

    async generateTableInvoice(req: Request, res: Response) {
        const controller = new GenerateTableInvoiceController(req, res);
        if (controller.ifNoTableId()) return controller.invalidTableId();

        const validTableId = await controller.verifyTableId();
        if (!validTableId) return AppResponce.badRequest(res);

        const invoice = await controller.generateInoivce();
        res.send(invoice);
    }

    async generateCustomInvoice(req: Request, res: Response) {
        const controller = new GenerateCustomInvoiceController(req, res);

        if (!controller.checkBodyInput()) {
            return AppResponce.badRequest(res);
        }

        const validTableId = await controller.verifyTableId();
        if (!validTableId) return controller.invalidTableId();

        const invoice = await controller.generateInoivce();
        res.send(invoice);
    }

    async addNewService(req: Request, res: Response) {
        const controller = new AddServiceInvoiceController(req, res);

        if (!controller.verifyInput()) {
            return AppResponce.badRequest(res);
        }

        const validTableId = await controller.checkTableId();
        const validTruckId = await controller.checkTruckId();

        if (!validTableId) return controller.invalidTableId();
        if (!validTruckId) return controller.invalidTruckId();

        controller.setDriverId();
        await controller.add();
        res.send("Service Added");
    }

    async getInvoiceById(req: Request, res: Response) {
        const invoiceId = req.params.invoiceId;
        const invoiceData = await InvoiceModule.getInvoiceById(invoiceId);
        if (invoiceData.length > 0) {
            const invoice = new InvoiceConverter(invoiceData).convert();
            return res.send(invoice);
        }
        res.status(404).send("No Invoice Found");
    }

    async getTableInvoices(req: Request, res: Response) {
        const controller = new GetTableInvoicesController(req, res);
        const rows = await controller.getTableInvoices();
        if (rows.length <= 0) return res.send([]);
        const invoices = controller.convertToTableInvoice(rows);
        res.send(invoices);
    }

    async getAllInvoices(req: Request, res: Response) {
        const controller = new GetAllInvoiecsController(req, res);
        const rows = await controller.getInvoices();
        if (rows.length <= 0) return res.send([]);
        const invoices = controller.convertToTableInvoice(rows);
        res.send(invoices);
    }

    async deleteInvoices(req: Request, res: Response) {
        const controller = new DeleteInvoicesController(req, res);

        if (!controller.checkBodyInput()) {
            return AppResponce.badRequest(res);
        }

        await controller.delete();
        res.send("Delete Done");
    }

    async deleteInvoiceServices(req: Request, res: Response) {
        const controller = new DeleteInvoicesServicesController(req, res);

        if (!controller.checkInput()) {
            return AppResponce.badRequest(res);
        }

        const invoice = await controller.getInvoiceInfo();
        if (invoice.length <= 0) {
            return controller.invoiceNotFound();
        }

        const isPayed = controller.isInvoicePayed(invoice[0]);
        if (isPayed) {
            return controller.canNotDeleteFromInvoicePayed();
        }

        await controller.delete();
        res.send("Delete Done");
    }

    async payment(req: Request, res: Response) {
        const controller = new InvoicePaymentController(req, res);

        if (!controller.checkBodyInput()) {
            return AppResponce.badRequest(res);
        }

        const invoice = await controller.getInvoice();
        if (invoice.length <= 0) {
            return controller.invoiceNotFound();
        }

        if (controller.isUnPayed(invoice[0])) {
            await controller.payed();
            return controller.payedSuccess();
        }

        await controller.unPayed();
        controller.unPayedSuccess();
    }

    async saveInvoice(req: Request, res: Response) {
        const controller = new SaveInvoiceController(req, res);
        const save = await controller.save();
        if (save <= 0) {
            return controller.noInvoiceFound();
        }
        console.log(save);
        res.send('Invoice Saved');
    }
}