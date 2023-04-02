import { Response } from "express";

export function getDriverId(res: Response): any {
    return res.locals.user.driverId;
}