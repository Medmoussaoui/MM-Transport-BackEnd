import { Request, Response } from "express";
import { TrucksModule } from "../../module/trcuks.model";

export class TrucksController {
    async getTrucks(req: Request, res: Response) {
        const trucks = await TrucksModule.getTrucks();
        res.send(trucks);
    }

    async getTruckByTruckNumber(req: Request, res: Response) {
        /// const trucks = await TrucksModule.getTruckById();
        //res.send(trucks);
    }
}

