import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../startup/config";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

    let accessToken = req.header("access-token");
    if (!accessToken) return res.status(403).send('invalid Access Token');

    jwt.verify(accessToken, config.get("jwt-secretkey"), (err, json) => {

        if (err == undefined) {
            res.locals.user = json;
            return next();
        }

        if (err.message == "jwt expired") return res.status(403).send("access token expired");

        res.status(403).send("invalid Access Token");
    });
}

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const { user } = res.locals;
    if (user.isAdmin == true) return next();
    res.status(403).send("You do not have permition to aceess this resource");
} 