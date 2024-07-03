export interface Service {
    serviceId?: string,
    driverId?: string,
    truckId?: string,
    tableId?: string,
    driverName?: string,
    truckNumber?: string,
    truckOwner?: string
    boatName?: string,
    serviceType?: string,
    price?: number,
    note?: string,
    pay_from?: string,
    dateCreate?: string;
    inactive?: boolean;
}

export interface TransferServices {
    serviceIds: string[],
    from: string,
    to: string
}