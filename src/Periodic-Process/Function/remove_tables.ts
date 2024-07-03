/// this function will check the unVisible Tables if has 0 services
/// or the all table services is unPaid
/// to remove those tables
///

import { mysqldb } from "../../core/config/knex.db.config";
import { TablesModule } from "../../module/tables.model";

export class RemoveTablesScheduleProcess {
  /// just unVisible Tables effected
  ///
  async removeEveryEmptyTable() {
    await mysqldb("tables").delete().whereIn("tableId",
      mysqldb.select("tableId").from(TablesModule.tablesInfoView)
        .where("totalServices", "=", 0).andWhere({ visible: 0 })
    );
  }

  async removeEveryAllUnPaidServicesTables() {
    await mysqldb("tables").delete().whereIn("tableId",
      mysqldb.select("tableId").from(TablesModule.tablesInfoView)
        .where(mysqldb.raw("totalServices = totalUnPaidServices"))
        .andWhere(mysqldb.raw("(totalServices > 0 AND visible = 0)"))
    );
  }

  async run(): Promise<void> {
    try {
      await this.removeEveryEmptyTable();
      await this.removeEveryAllUnPaidServicesTables();
    } catch (err) { }
  }
}
