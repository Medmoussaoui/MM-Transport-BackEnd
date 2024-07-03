import { Request, Response } from "express";
import { TablesModule } from "../../module/tables.model";
import { Knex } from "knex";
import { mysqldb } from "../../core/config/knex.db.config";
import { TableEntity } from "../../module/entity/table_entity";
import { Service } from "../../module/entity/services.entity";
import { TrucksModule } from "../../module/trcuks.model";
import { ImportantResponceModel } from "../../module/important_responce_model";
import { ImportantResponceEntity } from "../../module/entity/important_responce_entity";
import { hasUncaughtExceptionCaptureCallback } from "process";

// export class CreateTableController {

//     req: Request;
//     res: Response;

//     constructor(req: Request, res: Response) {
//         this.req = req;
//         this.res = res;
//     }

//     successCreateTable(table: any) {
//         this.res.send(table);
//     }

//     checkIfNoTableName(): boolean {
//         const tableName = this.req.body.tableName;
//         if (tableName == undefined || tableName == "") return true;
//         return false;
//     }

//     tableNameRequired(): void {
//         this.res.status(400).send("Table Name Is Required");
//     }

//     async create(): Promise<any[]> {
//         const tableName = this.req.body.tableName;
//         let result = await TablesModule.createTable(tableName!);
//         return await TablesModule.getTableById(result[0]);
//     }
// }



export class CreateTableControllerExTwo {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.setDriverId();
    }

    successCreateTable(table: {}) {
        this.res.send(table);
    }

    setDriverId(): void {
        this.req.body.driverId = this.res.locals.user.driverId;
    }

    checkIfNoTableName(): boolean {
        const tableName = this.req.body.tableName;
        if (tableName == undefined || tableName == "") return true;
        return false;
    }

    async tableNameRequired(): Promise<void> {
        this.res.status(400).send("Table Name Is Required");
    }

    async create(): Promise<{}> {
        const model = new CreateTableModel(this.req.body);
        return await model.create();
    }
}



export class CreateTableModel {
    table: TableEntity;

    constructor(table: TableEntity) {
        this.table = table;
    }

    async create(): Promise<{}> {
        await mysqldb.transaction(async trx => {
            const tableId = await this.createTable(trx);
            this.table.tableId = tableId;
            await this.insertTableService(trx);
        });
        return { tableId: this.table.tableId };
    }

    async insertTableService(trx: Knex.Transaction) {
        let futures = [];
        for (let service of this.table.services ?? []) {
            futures.push(this.addNewService(service, trx));
        }
        await Promise.all(futures);
    }

    private async addNewService(service: Service, trx: Knex.Transaction): Promise<boolean> {
        let isValid = await this.checkTruckNumber(service, trx);
        if (!isValid) return false;
        await mysqldb("services")
            .insert({
                boatName: service.boatName?.trim(),
                serviceType: service.serviceType?.trim(),
                price: service.price,
                note: service.note,
                driverId: this.table.driverId,
                truckId: service.truckId,
                tableId: this.table.tableId,
                pay_from: service.pay_from,
                dateCreate: service.dateCreate,
            }).transacting(trx);
        return true;
    }

    async createTable(trx: Knex.Transaction): Promise<number> {
        const insert = await mysqldb("tables").insert({
            tableName: this.table.tableName,
        }).transacting(trx);
        return insert[0];
    }

    async checkTruckNumber(service: Service, trx: Knex.Transaction): Promise<boolean> {
        const { truckNumber, serviceType } = service;
        const noTruckId = (truckNumber == undefined) || truckNumber == "";
        const serviceIsPaye = (serviceType == "Paye");

        if (serviceIsPaye && noTruckId) return true;
        if (noTruckId) return false;

        const truck = await mysqldb("trucks").select("*").where({ truckNumber }).transacting(trx);
        if (truck.length > 0) {
            service.truckId = truck[0].truckId;
            return true;
        }
        return false;
    }
}

