import { Request, Response } from "express";
import { TablesModule } from "../../module/tables.model";

export class CreateTableController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    successCreateTable(table: any) {
        this.res.send(table);
    }

    checkIfNoTableName(): boolean {
        const tableName = this.req.header("tableName");
        if (tableName == undefined || tableName == "") return true;
        return false;
    }

    tableNameRequired(): void {
        this.res.status(400).send("Table Name Is Required");
    }

    async create(): Promise<any[]> {
        const tableName = this.req.header("tableName");
        return await TablesModule.createTable(tableName!);
    }

}

