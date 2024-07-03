import { Request, Response } from "express";
import { AddServiceController } from "../services/add_service_controller";
import { InvoiceModule } from "../../module/invoice.model";
import { mysqldb } from "../../core/config/knex.db.config";
import { Knex } from "knex";
import { Service } from "../../module/entity/services.entity";
import { ServicessModule } from "../../module/service.model";

export class InvoiceAddNewServiceController extends AddServiceController {
    constructor(req: Request, res: Response) {
        super(req, res);
    }

    verifyInput(): boolean {
        if (this.req.body.invoiceId == undefined) return false;
        return super.verifyInput();
    }

    async addServiceToInvoice(serviceId: number): Promise<number[]> {
        const { invoiceId } = this.req.body;
        return await InvoiceModule.addService(invoiceId, serviceId.toString());
    }

    async getInvoiceInfo(): Promise<any[]> {
        const { invoiceId } = this.req.body;
        return await InvoiceModule.getInvoiceInfo(invoiceId);
    }

    linkServiceWithInvoice(inoviceInfo: any): void {
        this.req.body.tableId = inoviceInfo.tableId;
        const isPaid = inoviceInfo.pay_status == "paid";
        if (isPaid) this.req.body.pay_from = inoviceInfo.invoiceId;
    }

    async add(): Promise<any> {
        const { invoiceId } = this.req.body;
        const serviceId = await new AddInoiceServiceModel(invoiceId, this.req.body).add();
        const query = await ServicessModule.getServiceById(serviceId.toString());
        return query[0];
    }

}


class AddInoiceServiceModel {

    invoiceId: number;
    service: Service;

    constructor(invoiceId: number, service: Service) {
        this.invoiceId = invoiceId;
        this.service = service;
    }

    private async insertNewService(trx: Knex.Transaction) {
        return mysqldb("services")
            .insert({
                boatName: this.service.boatName,
                serviceType: this.service.serviceType,
                price: this.service.price,
                note: this.service.note,
                driverId: this.service.driverId,
                truckId: this.service.truckId,
                tableId: this.service.tableId,
                pay_from: this.service.pay_from,
                dateCreate:this.service.dateCreate,
            }).returning("serviceId").transacting(trx);
    }

    private async linkNewServiceWithInvoice(trx: Knex.Transaction, serviceId: number) {
        return await mysqldb.insert({
            serviceId,
            "invoiceId": this.invoiceId,
        }).into("invoice_serveses").transacting(trx);
    }

    async add(): Promise<number> {
        let serviceId = 0;
        await mysqldb.transaction(async trx => {
            const service = await this.insertNewService(trx);
            serviceId = service[0];
            await this.linkNewServiceWithInvoice(trx, serviceId);
        });
        return serviceId;
    }
}