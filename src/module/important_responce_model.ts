import { mysqldb } from "../core/config/knex.db.config";
import { ImportantResponceEntity } from "./entity/important_responce_entity";

export class ImportantResponceModel {
  static async insertOne(data: ImportantResponceEntity): Promise<void> {
    await mysqldb("importantresponses").insert(data);
  }

  static async updateOne(data: ImportantResponceEntity): Promise<void> {
    await mysqldb("importantresponses").update({
      status_code: data.status_code,
      responce: data.responce,
    }).where({ request_id: data.request_id });
  }

  static async getReponce(request_id: string): Promise<ImportantResponceEntity | undefined> {
    let select = await mysqldb.select("*").from("importantresponses").where({ request_id });
    return select[0];
  }

  static async select(request_id: string) {
    return await mysqldb("importantresponses").select("*").where({ request_id });
  }
}
