CREATE TABLE Drivers(
    driverId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    driverName VARCHAR(40) NOT NULL,
    isAdmin TINYINT DEFAULT 0,
    username VARCHAR(30),
    password VARCHAR(255)
);

CREATE TABLE Tables(
    tableId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tableName VARCHAR(40) NOT NULL,
    dateCreate DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastEdit DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Partners(
    partnerId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    partnerName VARCHAR(40) NOT NULL
);

CREATE TABLE Trucks(
    truckId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    partnerId INT NOT NULL,
    truckNumber VARCHAR(40) NOT NULL,
    FOREIGN KEY(partnerId) REFERENCES Partners(partnerId)
);

CREATE TABLE Serveses(
    servesId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    driverId INT NOT NULL,
    truckId INT NOT NULL,
    tableId INT NOT NULL,
    boatName VARCHAR(30) NOT NULL,
    serviceType VARCHAR(30),
    price Float DEFAULT 0.0,
    note VARCHAR(50),
    pay_status VARCHAR(10) DEFAULT "unpay",
    dateCreate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(driverId) REFERENCES Drivers(driverId),
    FOREIGN KEY(truckId) REFERENCES Trucks(truckId),
    FOREIGN KEY(tableId) REFERENCES Tables(tableId)
);

CREATE TABLE Invoices(
    invoiceId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tableId INT NOT NULL,
    invoiceName VARCHAR(30) DEFAULT "non",
    pay_status VARCHAR(10) DEFAULT "unpay",
    dateCreate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tableId) REFERENCES Tables(tableId)
);

CREATE TABLE Invoice_serveses(
    servesId INT NOT NULL,
    invoiceId INT NOT NULL,
    FOREIGN KEY(servesId) REFERENCES Serveses(servesId),
    FOREIGN KEY(invoiceId) REFERENCES Invoices(invoiceId)
);

-----------------------
--- Table_services_view
CREATE VIEW Table_services_view AS
SELECT 
   tables.tableId,
   services.serviceId,
   services.boatName,
   services.serviceType, 
   services.price, 
   services.note, 
   services.pay_status,
   drivers.driverName,
   trucks.truckNumber,
   partners.partnerName AS "TruckOnwer",
   services.dateCreate
FROM 
    `tables`
INNER JOIN 
     services
ON tables.tableId = services.tableId
INNER JOIN drivers 
ON drivers.driverId = services.driverId
INNER JOIN trucks 
ON trucks.truckId = services.truckId
INNER JOIN partners 
ON partners.partnerId = trucks.partnerId
ORDER BY tables.tableId ASC, services.dateCreate DESC

-------------------------
--- Invoice_services_view
CREATE VIEW Invoice_services_view AS
SELECT 
   invoices.invoiceId,
   invoices.tableId,
   table_services_view.serviceId,
   invoices.invoiceName,
   invoices.pay_status AS "invoice_pay_status",
   invoices.dateCreate AS "invoice_date_create",
   table_services_view.boatName,
   table_services_view.serviceType,
   table_services_view.price,
   table_services_view.note,
   table_services_view.driverName,
   table_services_view.truckNumber,
   table_services_view.TruckOnwer,
   table_services_view.pay_status AS "service_pay_status",
   table_services_view.dateCreate AS "service_date_create"
FROM
   invoices
INNER JOIN 
   invoice_serveses
ON invoices.invoiceId = invoice_serveses.invoiceId
INNER JOIN table_services_view
ON table_services_view.serviceId = invoice_serveses.serviceId
ORDER BY invoiceId ASC, table_services_view.dateCreate DESC 

------------------
-- Table_info_view
CREATE VIEW table_info_view AS
SELECT DISTINCT
   tables.*,
   table_services_view.boatName
FROM 
   tables
INNER JOIN 
   table_services_view
ON tables.tableId = table_services_view.tableId
ORDER BY tableId ASC
LIMIT 3


--------------------
--- new_services_view
CREATE VIEW new_services_view AS
SELECT * from services WHERE tableId IS NULL
ORDER BY driverId ASC, dateCreate DESC;
