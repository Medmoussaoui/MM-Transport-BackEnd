import { Request, Response } from "express";
import { getPageIndex } from "../../core/functions/get_page_index";
import { TablesModule } from "../../module/tables.model";

export class GetTablesController {


    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    getPage(): string {
        return this.req.header("page") ?? "0";
    }

    async get(): Promise<any[]> {
        const page = this.getPage();
        const pageIndex = getPageIndex(20, page);
        return await TablesModule.getTables(pageIndex);
    }
}