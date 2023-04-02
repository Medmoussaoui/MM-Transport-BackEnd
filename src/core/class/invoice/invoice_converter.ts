import { TableInvoice } from "../../../module/entity/invoice.entity";
import { Service } from "../../../module/entity/services.entity";

export class InvoiceConverter {
    invoice: TableInvoice = {};
    invoiceData: any[];

    constructor(invoiceData: any[]) {
        this.invoiceData = invoiceData;
        if (invoiceData.length >= 1) {
            this.initInvoiceInfo();
        }
    }

    initInvoiceInfo(): void {
        const row = this.invoiceData[0];
        this.invoice.invoiceId = row.invoiceId;
        this.invoice.tableId = row.tableId;
        this.invoice.invoiceName = row.invoiceName;
        this.invoice.totalSummation = 0;
        this.invoice.totalPayingOff = 0;
        this.invoice.finalTotal = 0;
        this.invoice.pay_status = row.invoice_pay_status;
        this.invoice.dateCreate = row.invoice_date_create;
        this.invoice.services = [];
    }

    extractService(service: any): Service {
        return {
            serviceId: service.serviceId,
            boatName: service.boatName,
            serviceType: service.serviceType,
            price: service.price,
            note: service.note,
            driverName: service.driverName,
            truckNumber: service.truckNumber,
            truckOwner: service.TruckOwner,
            pay_from: service.service_pay_from,
            dateCreate: service.service_date_create,
        }
    }

    isServicePaid(service: Service): boolean {
        // we check if the service is paid from another invoice because 
        // if yes should exclude the service price with an 
        // accounting of the invoice
        const currentInvoiceId = this.invoice.invoiceId?.toString();
        return (service.pay_from != null && service.pay_from != currentInvoiceId);
    }

    addExtractedService(service: Service): void {
        this.invoice.services?.push(service);
        if (this.isServicePaid(service)) return;

        if (service.serviceType == "Paye") {
            this.icrementTotalPayingOff(service.price!);
            return;
        }

        this.icrementTotalSummition(service.price!);
    }

    icrementTotalSummition(price: number): void {
        this.invoice.totalSummation! += price!;
    }

    icrementTotalPayingOff(price: number): void {
        this.invoice.totalPayingOff! += price!;
    }

    setFinalTotal(): void {
        const { totalPayingOff, totalSummation } = this.invoice;
        this.invoice.finalTotal = (totalSummation! - totalPayingOff!);
    }

    convert(): TableInvoice {
        for (let row of this.invoiceData) {
            const service = this.extractService(row);
            this.addExtractedService(service);
        }
        this.setFinalTotal();
        return this.invoice;
    }
}