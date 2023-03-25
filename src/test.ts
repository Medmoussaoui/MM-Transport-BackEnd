import { mysqldb } from "./core/config/knex.db.config";
import jwt from "jsonwebtoken";
import { config } from "./startup/config";
import { TrucksModule } from "./module/trcuks.model";
import { TablesModule } from "./module/tables.model";
import { ServicessModule } from "./module/service.model";
import { stringify } from "querystring";
import { rmSync } from "fs";

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
        price: "150",
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
        "serviceId": "22",
        "boatName": "test mabroka edit",
        "serviceType": "test chbak esit",
        "price": "150",
        "date": "2023-03-25 14:27:20"
    };

    return await ServicessModule.update(body);
}

async function setLastEdit() {
    return await TablesModule.updateLastEdit("1");
}

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
}

runTests();
////////////////////////// RUN TEST ///////////////////////////////


