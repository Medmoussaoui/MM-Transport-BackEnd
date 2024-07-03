import { Response } from "express";

export function getDriverUserName(res: Response): string {
    return res.locals.user.username;
}