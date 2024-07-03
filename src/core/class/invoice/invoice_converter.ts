import { Invoice } from "../../../module/entity/invoice.entity";
import { Service } from "../../../module/entity/services.entity";

export class InvoiceConverter {
    invoice: Invoice = {};

    isInvoiceInfoInit: boolean = false;

    /// store first invoice pay_satus value in pay_status variable to get back
    /// the first value when we need
    ///
    pay_status: string = "";

    initInvoiceInfo(row: any): void {
        this.invoice.invoiceId = row.invoiceId;
        this.invoice.tableId = row.tableId;
        this.invoice.invoiceName = row.invoiceName;
        this.invoice.totalSummation = 0;
        this.invoice.totalPayingOff = 0;
        this.invoice.finalTotal = 0;
        this.invoice.pay_status = row.invoice_pay_status;
        this.invoice.padiDate = row.invoice_paid_date;
        this.invoice.dateCreate = row.invoice_date_create;
        this.invoice.save = row.save;
        this.invoice.services = [];
    }

    toService(service: any): Service {
        return {
            tableId: service.service_table_id,
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

    /// isServiceInactive() check if the service is paid from other invoice
    /// to make sure not include the service price with the total of invoice
    /// because the current invoice is Aready paid from other invoice
    /// 
    /// And if the invoice pay_status = "Paid" and the current service pay_status = null
    /// we should not include the price of current service to total price of invoice too
    /// this situation happen when was the service paid in other invoice and the user 
    /// cancel the invoice payment so the current service pay_status will be null
    /// and currently the current invoice is paid with out the current service
    ///
    /// 
    isServiceInactive(service: Service): boolean {
        if (this.isPaidFromOtherInvoice(service)) {
            return true;
        }

        if (this.isUnPaidFromOtherInvoice(service)) {
            return true;
        }

        return false
    }

    /// when cancel invoice payment the service.pay_from will be null
    /// 
    isUnPaidFromOtherInvoice(service: Service): boolean {
        const invoicePaid = this.pay_status == "paid";
        return (service.pay_from == null) && invoicePaid;
    }

    isPaidFromOtherInvoice(service: Service): boolean {
        if (service.pay_from) {
            return service.pay_from != this.invoice.invoiceId?.toString();
        }
        return false;
    }



    isPayingOff(serviceType: string) {
        if (serviceType == "Paye") return true;
        if (serviceType == "دفع") return true;
        if (serviceType == "مدفوعة") return true;
        if (serviceType == "تسبيق") return true;
        if (serviceType == "خالص") return true;
        if (serviceType == "شديت") return true;
        if (serviceType == "خديت") return true;
        return false;
    }

    addServiceToInvoice(service: Service): void {
        this.invoice.services?.push(service);

        if (this.isServiceInactive(service)) {
            service.inactive = true;
            if (this.invoice.inactive == null) this.invoice.inactive = true;
            return;
        }

        this.invoice.inactive = false;
        if (this.isPayingOff(service.serviceType!)) return this.icrementTotalPayingOff(service.price!);
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

    insert(row: any): Invoice {
        if (!this.isInvoiceInfoInit) {
            this.initInvoiceInfo(row);
            this.pay_status = this.invoice.pay_status!;
            this.isInvoiceInfoInit = true;

        }
        const service = this.toService(row);
        this.addServiceToInvoice(service);
        this.setFinalTotal();
        return this.invoice;
    }
}