import { Request, Response } from "express";
import { TransferResult } from "../../module/entity/smart_trasnfer.entity";
import { SmartTransferModule } from "../../module/Smart_transfer.model";
import { mysqldb } from "../../core/config/knex.db.config";
import { getDriverId } from "../../core/functions/get_driver_id";

type AutoTransferResult = {
    total: number,
    knownTables: number,
    unknownTables: number,
};

export class SmartTransferServices {

    req: Request;
    res: Response;
    knownBoats: number = 0;
    unKnownBoats: number = 0;
    db: SmartTransferModule = new SmartTransferModule();
    driverId: number;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        this.driverId = getDriverId(res);
    }

    result: AutoTransferResult = {
        knownTables: 0,
        unknownTables: 0,
        total: 0
    };

    canTransfer = () => this.result.knownTables++;
    canNotTransfer = () => this.result.unknownTables++;

    transferResult(): AutoTransferResult {
        return {
            total: this.result.knownTables + this.result.unknownTables,
            knownTables: this.result.knownTables,
            unknownTables: this.result.unknownTables,
        };
    }

    async getBoatNames(): Promise<any[]> {
        return await mysqldb.distinct("boatName").from("services_view").where({
            tableId: null
        });
    }

    async findTablesByBoatName(boatName: string): Promise<any> {
        return await mysqldb.distinct("tableId").from("services_view").where({
            "boatName": boatName.trim(),
        }).whereNotNull("tableId");
    }

    async transferToTable(tableId: number, boatName: string): Promise<number> {
        return await mysqldb.update({ tableId }).from("services").where({
            "boatName": boatName,
            "tableId": null,
        })
    }

    async transferSignleBoatName(boatName: string): Promise<any> {
        const tables = await this.findTablesByBoatName(boatName);
        if (tables.length == 1) {
            this.canTransfer();
            await this.transferToTable(tables[0].tableId, boatName);
            return;
        }
        return this.canNotTransfer();
    }

    async start(): Promise<AutoTransferResult> {
        const boats = await this.getBoatNames();
        if (boats.length <= 0) return this.transferResult();
        let transfer = [];
        for (let boat of boats) {
            const { boatName } = boat;
            const task = async () => this.transferSignleBoatName(boatName);
            transfer.push(task());
        }
        await Promise.all(transfer);
        return this.transferResult();
    }


}


