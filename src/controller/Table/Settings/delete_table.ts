import { Request, Response } from "express";
import { mysqldb } from "../../../core/config/knex.db.config";
import { Knex } from "knex";
import { TablesModule } from "../../../module/tables.model";

export class DeleteTableController {

    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }


    successDeleteTable(): void {
        this.res.send("Delete Table Success");
    }

    async delete() {
        const { tableId } = this.req.params;
        await new DeleteTableModel(tableId).delete();
    }

}

export class DeleteTableModel {

    tableId: number | string;


    constructor(tableId: number | string) {
        this.tableId = tableId;
    }

    noTable = (table: any) => table == undefined;


    async delete() {
        await mysqldb.transaction(async trx => {
            const table = await this.getTableInfo(trx);
            if (this.noTable(table)) return;
            if (table["totalServices"] == table["totalUnpaidServices"]) {
                return await this.deleteTable(trx);
            }
            await this.markTableAsUnVisible(trx);
            await this.deleteUnPaidTableServices(trx);
        });
    }

    private async getTableInfo(trx: Knex.Transaction): Promise<any> {
        const query = await mysqldb.select("*")
            .from(TablesModule.tablesInfoView)
            .where({ "tableId": this.tableId }).transacting(trx);
        return query[0];
    }

    private async deleteUnPaidTableServices(trx: Knex.Transaction) {
        await mysqldb("services").delete().where({ "pay_from": null, "tableId": this.tableId })
            .transacting(trx);
    }

    private async markTableAsUnVisible(trx: Knex.Transaction) {
        return await mysqldb("tables").update({ visible: 0 })
            .where({ "tableId": this.tableId }).transacting(trx);
    }

    private async deleteTable(trx: Knex.Transaction) {
        return await mysqldb("tables").delete().where({ "tableId": this.tableId })
            .transacting(trx);
    }

    
}