import express from "express";

export const invoicesRoute = express.Router();

invoicesRoute.get('/', (req, res) => { });
invoicesRoute.get('/:invoiceId', (req, res) => { });
invoicesRoute.get('/table/:tableId', (req, res) => { });

/// https://www.api.transport/invoice/new/table/454545445465448dsdsds
/// https://www.api.transport/invoice/new/custom/

invoicesRoute.post('/new/table/:tableId', (req, res) => { });
invoicesRoute.post('/new/custom/', (req, res) => { });
invoicesRoute.post('/save/:invoiceId', (req, res) => { });
invoicesRoute.post('/payment/:invoiceId/:status', (req, res) => { });
invoicesRoute.post('/service/new/:invoiceId', (req, res) => { });

invoicesRoute.delete('/delete/:invoiceId', (req, res) => { });
invoicesRoute.delete('/services/delete/:invoiceId/:serviceId', (req, res) => { });

invoicesRoute.put('/rename/:newname/:invoiceId', (req, res) => { });
