import express from "express";
import { InvoiceController } from "../controller/Invoice";



//// .............../Invoice/

export const invoicesRoute = express.Router();
const controller = new InvoiceController();


invoicesRoute.get('/', controller.getAllInvoices);
invoicesRoute.get('/:invoiceId', controller.getInvoiceById);
invoicesRoute.get('/table/:tableId', controller.getTableInvoices);
invoicesRoute.post('/generate/table', controller.generateTableInvoice);
invoicesRoute.post('/generate/custom', controller.generateCustomInvoice);
invoicesRoute.post('/services/new', controller.addNewService);
invoicesRoute.delete('/services/delete', controller.deleteInvoiceServices)
invoicesRoute.post('/payment', controller.payment)
invoicesRoute.put('/save/:invoiceId',controller.saveInvoice)
invoicesRoute.delete('/delete', controller.deleteInvoices);