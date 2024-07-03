import { mysqldb } from "../core/config/knex.db.config";
import { Service } from "./entity/services.entity";

export class ServicessModule {
    static newServicesView: string = "new_services_view";
    static ServicesView: string = "services_view";

    static async addNewService(service: Service): Promise<any[]> {
        return await mysqldb("services")
            .insert({
                boatName: service.boatName?.trim(),
                serviceType: service.serviceType?.trim(),
                price: service.price,
                note: service.note,
                driverId: service.driverId,
                truckId: service.truckId,
                tableId: service.tableId,
                pay_from: service.pay_from,
                dateCreate: service.dateCreate,
            }).returning("*");
    }

    static async getServiceById(serviceId: string): Promise<any[]> {
        return await mysqldb(ServicessModule.ServicesView)
            .select("*")
            .where({ serviceId });
    }

    static async getServices(page: number) {
        return await mysqldb(ServicessModule.newServicesView).select("*")
            .where({ tableId: null, pay_from: null })
    }

    static async delete(serviceIds: any[]): Promise<number> {
        return await mysqldb("services")
            .whereIn("serviceId", serviceIds)
            .andWhereRaw("(pay_from is null OR pay_from = ?)", [-1])
            .del()
    }

    static async update(service: Service): Promise<any[]> {
        const { serviceId } = service;
        return await mysqldb("services").update({
            boatName: service.boatName?.trim(),
            serviceType: service.serviceType?.trim(),
            price: service.price,
            note: service.note,
            dateCreate: service.dateCreate,
            truckId: service.truckId,
            pay_from: service.pay_from,
        }).where({ serviceId }).returning("*");
    }

}