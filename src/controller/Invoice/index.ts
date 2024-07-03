import { Request, Response } from "express";
import { AppResponce } from "../../core/constant/appResponce";
import { InvoiceModule } from "../../module/invoice.model";
import { DeleteInvoicesController } from "./Delete_invoices";
import { DeleteInvoicesServicesController } from "./Delete_invoice_services";
import { GenerateCustomInvoiceController } from "./Generate_custom_invoice";
import { GenerateTableInvoiceController } from "./Generate_table_invoice";
import { GetAllInvoiecsController } from "./Get_all_invoices";
import { GetTableInvoicesController } from "./Get_table_invoices";
import { InvoicePaymentController } from "./Payment_invoice";
import { SaveInvoiceController } from "./Save_invoice";
import { convertToInvoice } from "../../core/functions/convert_to_invoice";
import { TableInvoices } from "../../module/entity/invoice.entity";
import { GetLinkedInvoicesController } from "./linked_invoices";
import { InvoiceSearchController } from "./invoice_search";
import { InvoiceAddNewServiceController } from "./add_new_service";
import { ChangeInvoiceNameController } from "./change_invoice_name";

export class InvoiceController {

    async generateTableInvoice(req: Request, res: Response) {
        const controller = new GenerateTableInvoiceController(req, res);
        if (controller.ifNoTableId()) return controller.invalidTableId();

        const table = await controller.getTableById();

        if (table == undefined) return controller.noTableFound();
        controller.setInvoicName(table.tableName);

        const hasServices = controller.hasService(table);
        if (!hasServices) {
            res.status(400).send("table dosn't have any services");
            return;
        }

        const invoice = await controller.generateInoivce();
        res.status(200).send(invoice);
    }

    async generateCustomInvoice(req: Request, res: Response) {
        const controller = new GenerateCustomInvoiceController(req, res);

        if (!controller.checkBodyInput()) {
            return AppResponce.badRequest(res);
        }

        if (controller.getTableId()) {
            const table = await controller.getTableById();
            if (table) controller.setInvoicName(table.tableName);
        }

        const invoice = await controller.generateInoivce();
        res.send(invoice);
    }

    async addNewService(req: Request, res: Response) {
        const controller = new InvoiceAddNewServiceController(req, res);

        if (!controller.verifyInput()) return AppResponce.badRequest(res);

        const invoice = await controller.getInvoiceInfo();

        if (invoice.length <= 0) {
            return res.status(404).send("No Invoice Found");
        }

        controller.linkServiceWithInvoice(invoice[0]);

        const validTruckId = await controller.checkTruckNumber();

        if (!validTruckId) return controller.invalidTruckId();

        const service = await controller.add();
        res.status(201).send(service);
    }

    async getInvoiceById(req: Request, res: Response) {
        const invoiceId = req.params.invoiceId;
        const invoiceData = await InvoiceModule.getInvoiceById(invoiceId);
        if (invoiceData.length > 0) {
            const invoice = convertToInvoice(invoiceData);
            return res.send(invoice);
        }
        res.status(404).send("No Invoice Found");
    }

    async search(req: Request, res: Response) {
        const controller = new InvoiceSearchController(req, res);
        const queryOne = await controller.getInvoiceIdsByMatchKeyword();
        if (queryOne.length <= 0) return res.send([]);
        const invoiceIds = queryOne.map(i => i["invoiceId"]);
        const queryTwo = await controller.getInvoicesByIds(invoiceIds);
        if (queryTwo.length <= 0) return res.send([]);
        const invoices = controller.convertQueryToInvoices(queryTwo);
        res.send(invoices);
    }

    async getTableInvoices(req: Request, res: Response) {
        const controller = new GetTableInvoicesController(req, res);

        const page = controller.getPage();
        const query = await controller.getInvoiceIds(page);

        if (query.length <= 0) {
            return res.send([]);
        }

        let invoiceIds = query.map(item => item["invoiceId"]);

        const rows = await controller.getTableInvoices(invoiceIds);

        if (rows.length <= 0) {
            return res.send([]);
        }

        const tableInvoices = controller.convertToTableInvoices(rows);
        res.send(tableInvoices);
    }

    async getLinkedInvoices(req: Request, res: Response) {
        const controller = new GetLinkedInvoicesController(req, res);
        const invoiceId = controller.with();
        const invoiceIds = await controller.getLinkedInvoiceIds(invoiceId);
        if (invoiceIds.length <= 0) return res.send([]);
        const invoices = await controller.getInvoices(invoiceIds);
        res.send(invoices);
    }


    async getAllInvoices(req: Request, res: Response) {
        const controller = new GetAllInvoiecsController(req, res);
        const page = controller.pageIndex();

        let invoicesWithNoTable: TableInvoices[] = [];

        if (page == 0) {
            const rows = await controller.getInvoicesWithNoTable();
            invoicesWithNoTable = controller.convertToTableInvoices(rows);
        }

        const tableIds = await controller.getTableIds(page);
        if (tableIds.length <= 0) {
            return res.send(invoicesWithNoTable);
        }

        const rows = await controller.getInvoices(tableIds);
        if (rows.length <= 0) {
            return res.send(invoicesWithNoTable);
        }

        const invoices = controller.convertToTableInvoices(rows);
        if (invoicesWithNoTable.length >= 1) {
            invoices.push(...invoicesWithNoTable);
        }

        res.send(invoices);
    }

    async deleteInvoices(req: Request, res: Response) {
        const controller = new DeleteInvoicesController(req, res);
        if (!controller.checkBodyInput()) return AppResponce.badRequest(res);
        await controller.delete();
        res.send("Delete Done");
    }

    async deleteInvoiceServices(req: Request, res: Response) {
        const controller = new DeleteInvoicesServicesController(req, res);

        if (!controller.checkInput()) return AppResponce.badRequest(res);

        const invoice = await controller.getInvoiceInfo();
        if (invoice.length <= 0) return controller.invoiceNotFound();

        await controller.delete(invoice[0]);
        res.send("Delete Done");
    }

    async payment(req: Request, res: Response) {
        const controller = new InvoicePaymentController(req, res);

        if (!controller.checkBodyInput()) {
            return AppResponce.badRequest(res);
        }

        const query = await controller.getInvoice();
        if (query.length <= 0) {
            return controller.invoiceNotFound();
        }

        if (controller.isInactiveInvoice(query[0])) {
            return res.status(400).send("Invoice is Inactive");
        }

        if (controller.payStatus() == "paid") {
            await controller.payInvoice();
            return controller.refrechInvoice();
        }

        await controller.cancelPayment();
        controller.refrechInvoice();
    }

    async saveInvoice(req: Request, res: Response) {
        const controller = new SaveInvoiceController(req, res);
        const save = await controller.save();
        if (save <= 0) return controller.noInvoiceFound();
        res.send('Invoice Saved');
    }

    async changeInvoiceName(req: Request, res: Response) {
        const controller = new ChangeInvoiceNameController(req, res);
        if (!controller.checkBodyInput()) {
            return res.status(400).send("Bad Request");
        }
        await controller.updateName();
        res.send("Invoice Name Changed");
    }
}