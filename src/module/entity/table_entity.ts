import { Service } from "./services.entity";

export interface TableEntity {
  driverId?: number,
  tableId?: number,
  tableName?: string,
  boats?: string,
  dateCreate?: string,
  lastEdit?: string,
  services?: Service[]
}