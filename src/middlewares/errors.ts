import { Request, Response } from "express";
import { AppResponce } from "../core/constant/appResponce";

// To catch any async internal server errors happen !
function expressAsyncCatcher(routeHandler: (req: Request, res: Response) => Promise<any>) {
    return async (req: Request, res: Response) => {
        try {
            await routeHandler(req, res);
        } catch (err) {
            AppResponce.serverFailure(res, err);
        }
    }
}


function expressCatcher(routeHandler: (req: Request, res: Response) => Promise<any>) {
    return (req: Request, res: Response) => {
        try {
            routeHandler(req, res);
        } catch (err) {
            AppResponce.serverFailure(res);
        }
    }
}

export { expressAsyncCatcher, expressCatcher }

