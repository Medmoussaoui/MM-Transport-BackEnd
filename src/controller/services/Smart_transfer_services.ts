import { Request, Response } from "express";
import { TransferResult } from "../../module/entity/smart_trasnfer.entity";
import { SmartTransferModule } from "../../module/Smart_transfer.model";


export class SmartTransferServices {

    req: Request;
    res: Response;
    knownBoats: string[] = [];
    unKnownBoats: string[] = [];
    db: SmartTransferModule = new SmartTransferModule();

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    statusCode(): number {
        return (this.knownBoats.length >= 1) ? 200 : 400;
    }

    addToknownBoat(boatName: string): void {
        this.knownBoats.push(boatName);
    }

    addToUnKnownBoat(boatName: string): void {
        this.unKnownBoats.push(boatName);
    }

    isBoatNameUnKnown(tables: any[]): boolean {
        /// if the total tables that return in the List more than 1 that means there 
        /// are many tables associated with the same boat name here we can not 
        /// know exactly which is the right [Table] to transfer [Services] 
        /// Or if no table returns we too can not transfer 
        /// [Services] to an unknown Table
        return tables.length > 1 || tables.length == 0
    }

    generateMessage(): string {
        if (this.knownBoats.length >= 1) {
            return "services are transferred successfully";
        }
        return "can not transfer services that its boat names are unknown";
    }

    getTransferResult(): TransferResult {
        let message = this.generateMessage();
        return {
            message,
            known: this.knownBoats,
            unKnown: this.unKnownBoats,
        }
    }

    async transfer(services: any[]): Promise<TransferResult> {

        let fetch = [];

        for (let service of services) {
            const { boatName } = service;
            const tables = await this.db.getTablesAssociatedWithBoatName(boatName);

            if (this.isBoatNameUnKnown(tables)) {
                this.addToUnKnownBoat(boatName);
                continue;
            }

            this.addToknownBoat(boatName);
            const task = async () => await this.db.transferServicesToTable(boatName, tables[0].tableId);
            fetch.push(task());
        }

        await Promise.all(fetch);
        return this.getTransferResult();
    }

}
