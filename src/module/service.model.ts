import { mysqldb } from "../core/config/knex.db.config";
import { Service } from "./entity/services.entity";

export class ServicessModule {
    static async addNewService(service: Service): Promise<any[]> {
        return await mysqldb("Services").insert({
            boatName: service.boatName,
            serviceType: service.serviceType,
            price: service.price,
            note: service.note,
            driverId: service.driverId,
            truckId: service.truckId,
            tableId: service.tableId,
        }).returning("*");
    }

    static async getServiceById(serviceId: string): Promise<any[]> {
        return await mysqldb("services").select("*").where({ serviceId });
    }

    static async getServices(driverId: string, page: number) {
        return await mysqldb("new_services_view").select("*")
            .where({ driverId })
            .limit(20)
            .offset(page);
    }

    static async delete(serviceIds: any[]): Promise<number> {
        return await mysqldb("services")
            .whereIn("serviceId", serviceIds)
            .andWhere({ pay_from: null })
            .del()
    }

    static async update(service: Service): Promise<any[]> {
        const { serviceId } = service;
        return await mysqldb("services").update({
            boatName: service.boatName,
            serviceType: service.serviceType,
            price: service.price,
            note: service.note,
            dateCreate: service.dateCreate,
        }).where({ serviceId }).returning("*");
    }

}