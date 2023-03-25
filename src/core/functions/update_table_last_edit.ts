import { TablesModule } from "../../module/tables.model";

export async function setTableLastEdit(tableId: string): Promise<number> {
    const noTableId = (tableId == undefined) || tableId == "";
    if (noTableId) return 0;
    return await TablesModule.updateLastEdit(tableId);
}