import express from "express";
import { InvoiceController } from "../controller/Invoice";
import { expressAsyncCatcher, expressCatcher } from "../middlewares/errors";



//// .............../Invoice/

export const invoicesRoute = express.Router();
const controller = new InvoiceController();


invoicesRoute.get('/', expressAsyncCatcher(controller.getAllInvoices));
invoicesRoute.get('/:invoiceId', expressAsyncCatcher(controller.getInvoiceById));
invoicesRoute.get('/table/:tableId', expressAsyncCatcher(controller.getTableInvoices));
invoicesRoute.post('/generate/table', expressAsyncCatcher(controller.generateTableInvoice));
invoicesRoute.post('/generate/custom', expressAsyncCatcher(controller.generateCustomInvoice));
invoicesRoute.post('/services/new', expressAsyncCatcher(controller.addNewService));
invoicesRoute.delete('/services/delete', expressAsyncCatcher(controller.deleteInvoiceServices))
invoicesRoute.put('/save/:invoiceId', expressAsyncCatcher(controller.saveInvoice))
invoicesRoute.delete('/delete', expressAsyncCatcher(controller.deleteInvoices));
invoicesRoute.post('/payment', expressAsyncCatcher(controller.payment))