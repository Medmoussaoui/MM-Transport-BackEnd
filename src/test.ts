import { mysqldb } from "./core/config/knex.db.config";
import jwt from "jsonwebtoken";
import { config } from "./startup/config";
import { TrucksModule } from "./module/trcuks.model";
import { TablesModule } from "./module/tables.model";
import { ServicessModule } from "./module/service.model";
import { stringify } from "querystring";
import { rmSync } from "fs";
import { InvoiceModule } from "./module/invoice.model";
import { InvoiceConverter } from "./core/class/invoice/invoice_converter";
import { TableInvoice } from "./module/entity/invoice.entity";
import { Service } from "./module/entity/services.entity";

async function login() {

    /// TEST 
    let { username, password } = { username: "", password: "" };
    if (!username || !password) {
        return console.log("password and username required");
    }

    const select = await mysqldb("Drivers").select("*").where({ username });
    const user = select[0];

    const jwtObject = {
        username: user["username"],
        driverId: user["driverId"],
        driverName: user["driverName"],
    }

    const accessToken = jwt.sign(jwtObject, config.get('jwt-secretkey'), { expiresIn: 60 * 60 * 24 * 30 * 12 });
    console.log(accessToken);
}


/// TEST (checkTableId)
async function checkTableId(): Promise<boolean> {
    const { tableId } = { tableId: "50" };
    const noTableId = (!tableId) || tableId == "";

    if (noTableId) {
        console.log('No Table Id Find');
        return true;
    }

    const table = await TablesModule.getTableById(tableId);
    if (table.length > 0) {
        console.log(table);
        return true;
    }

    console.log("invalid Table Id");
    return false;
}

/// TEST (checkTruckId)
async function checkTruckId(): Promise<boolean> {
    const { truckId, serviceType } = { truckId: undefined, serviceType: "Paye" };
    const noTruckId = (!truckId) || truckId == "";

    if (serviceType == "Paye" && noTruckId) return true;
    if (noTruckId) return false;

    const truck = await TrucksModule.getTruckById(truckId);
    if (truck.length > 0) return true;
    return false;
}


async function addService() {
    const body = {
        boatName: "test from service",
        serviceType: "node js",
        price: 150,
        note: "hiii",
        driverId: "1",
        truckId: "1",
        tableId: undefined,
    };
    const result = await ServicessModule.addNewService(body);
    console.log(result);
}

// TEST (checkServiceId)
async function checkServiceId(): Promise<boolean> {
    const { serveceId } = { serveceId: "22" };
    const service = await ServicessModule.getServiceById(serveceId);
    if (service.length > 0) return true;
    return false;
}

async function updateService() {
    const body = {
        serviceId: "22",
        boatName: "test mabroka edit",
        serviceType: "test chbak esit",
        price: 150,
        dateCreate: "2023-03-25 14:27:20"
    };

    return await ServicessModule.update(body);
}

async function setLastEdit() {
    return await TablesModule.updateLastEdit("1");
}

async function testUpdateTableService() {
    const body = {
        serviceId: "48",
        tableId: "100",
        boatName: "tirisit UPDATE",
        serviceType: "dibardage",
        price: 300,
        dateCreate: "2023-03-26 15:57:18",
        note: ""
    };

    const result = await ServicessModule.update(body);
    console.log(result);
}

async function addTableInvoiceServices() {
    const result = await InvoiceModule.newTableInvoice("2");
    console.log(result);
}

async function createInvoice() {
    const result = await InvoiceModule.createInvoice("2");
    console.log(result);
}

async function testInvoiceConverter() {
    const invoiceData = await InvoiceModule.getInvoiceById("19");
    const invoiceConverter = new InvoiceConverter(invoiceData);
    const invoice = invoiceConverter.convert();
    console.log(invoice);
}


function convertTableInvoiceRows(rows: any[]): TableInvoice[] {
    let currentInvoiceId;
    let invoiceConverter: InvoiceConverter;
    const tableInvoices: TableInvoice[] = [];

    for (let row of rows) {
        if (currentInvoiceId != row.invoiceId) {
            invoiceConverter = new InvoiceConverter([row]);
            tableInvoices.push(invoiceConverter.invoice);
            currentInvoiceId = invoiceConverter.invoice.invoiceId;
        }
        invoiceConverter!.invoiceData = [row];
        invoiceConverter!.convert();
    }

    return tableInvoices;
}


async function testGetTableInvoices() {
    const tableInvoiceRows = await InvoiceModule.tableInvoices("2");
    console.log(tableInvoiceRows);
    console.log("===================CONVERTED==================");
    const tableInvoices = convertTableInvoiceRows(tableInvoiceRows);
    console.log("-- First Invoice ");
    console.log(tableInvoices[0]);
    console.log("--------------------------------------------------");
    console.log("-- Secound Invoice ");
    console.log(tableInvoices[0]);
}

/*
async function testSmartTransferService() {
    const controller = new TestSmartTransferServices();
    const service = await controller.db.getDriverServices(1);

    if (service.length <= 0) {
        console.log("No Services Fond");
        return;
    }
    console.log(service);
    console.log("/////////////////////////////////////////////");
    await controller.transfer(service);
    const statusCode = (controller.unKnownBoats.length <= 0) ? 400 : 200;
    console.log(controller.generateResponceBody());

    console.log("Can Not Transfer Unknown Services");
}
*/
////////////////////////// RUN TEST ///////////////////////////////
async function runTests() {

    // await checkTableId();
    // const result = await checkTruckId();
    //console.log(">> Check Truck Id Result : " + result);
    // const result = await checkServiceId();
    // const updateResult = await updateService();
    // console.log(">> checkServiceId() Result : " + result);
    // console.log(">> updateService() Result : " + updateResult);
    // const result = await setLastEdit();
    // sole.log(result);
    // testUpdateTableService();
    // addTableInvoiceServices();
    // createInvoice();
    // await testInvoiceConverter();
    // testGetTableInvoices();
    // testSmartTransferService();
}

runTests();
////////////////////////// RUN TEST ///////////////////////////////


