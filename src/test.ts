import { CreateTableModel } from "./controller/Table/Create_table";
import { ImportantResponceModel } from "./module/important_responce_model";


async function run() {

    // boatName: service.boatName?.trim(),
    // serviceType: service.serviceType?.trim(),
    // price: service.price,
    // note: service.note,
    // driverId: service.driverId,
    // truckId: service.truckId,
    // tableId: this.table.tableId,
    // pay_from: service.pay_from,
    // dateCreate: service.dateCreate,


    // let controller = new CreateTableModel({
    //     tableName: "New Table",
    //     services: [
    //         {
    //             boatName: "test-1",
    //             serviceType: "test-1",
    //             truckNumber: "50 A 38548",
    //             price: 100,
    //             driverId: "1",
    //             pay_from: undefined,
    //             dateCreate: Date.now().toString(),
    //         },
    //         {
    //             boatName: "test-2",
    //             serviceType: "test-2",
    //             truckNumber: "50 A 38548",
    //             price: 100,
    //             driverId: "1",
    //             pay_from: undefined,
    //             dateCreate: Date.now().toString(),
    //         }
    //     ],
    // });
    // console.log("Strat...");
    // await controller.create();
    // console.log("End");

    const model = new ImportantResponceModel();
    const request_id = "moussaoui_MC:10F:E5:51:CC_newtable_11/1/2023 11: 28";
    const fake_request_id = "fake_MC:10F:E5:51:CC_newtable_11/1/2023 11: 28";

    // console.log("Start Reqgister...");
    // await model.registerReeponce({
    //     request_id: request_id,
    //     responce: "{ tableId: 10, tableName: 'new_table' }",
    //     status_code: 200,
    //     user_id: 1,
    // });

    // const item = await model.getReponce(fake_request_id);
    // if(item == undefined) return console.log("No Responce Found");
    // console.log(item);

    const jsonObject = "hi everybody";

    const responceText = JSON.stringify(jsonObject);
    console.log(responceText);

    let data
    try {
        data = JSON.parse(responceText);
    } catch (err) {
        console.log("Error Happen")
        data = responceText;
    }
    console.log(data);
}

run();