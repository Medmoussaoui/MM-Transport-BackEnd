import { Request, Response } from "express";
import { getPageIndex } from "../../../core/functions/get_page_index";
import { TablesModule } from "../../../module/tables.model";

export class GetTableServicesController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    tableIdRequired(): void {
        this.res.status(400).send("Table Id Is required!");
    }

    checkIfNoTableId(): boolean {
        const tableId = this.req.header('tableId')!;
        return tableId == undefined || tableId == "";
    }

    getTableId(): string {
        return this.req.header('tableId')!;
    }

    getPage(): string {
        return this.req.header("page") ?? "";
    }

    async getServices(): Promise<any[]> {
        const tableId = this.getTableId();
        const page = this.getPage();
        const pageIndex = getPageIndex(20, page);
        const service = await TablesModule.getServices(tableId, pageIndex);
        await TablesModule.updateLastEdit(tableId);
        return service;
    }
}