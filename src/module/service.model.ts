import { mysqldb } from "../core/config/knex.db.config";
import { Service } from "./entity/services.entity";

export class ServicessModule {
    static async addNewService(service: Service) {
        return await mysqldb("Services").insert({
            boatName: service.boatName,
            serviceType: service.serviceType,
            price: service.price,
            note: service.note,
            driverId: service.driverId,
            truckId: service.truckId,
            tableId: service.tableId
        });
    }

    static async getServiceById(serviceId: string): Promise<any[]> {
        return await mysqldb("services").select("*").where({ serviceId });
    }


    static async deleteOne(serviceId: string): Promise<number> {
        return await mysqldb("services").delete().where({ serviceId });
    }

    static async deleteMulti(serviceIds: string[]): Promise<number> {
        return await mysqldb("services").delete().whereIn("serviceId", serviceIds);
    }

    static async update(service: Service): Promise<any> {
        const { serviceId } = service;
        return await mysqldb("services").update({
            boatName: service.boatName,
            serviceType: service.serviceType,
            price: service.price,
            note: service.note,
            dateCreate: service.dateCreate,
        }).where({ serviceId });
    }

}