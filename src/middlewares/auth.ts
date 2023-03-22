import { NextFunction, Request, Response } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const user = (req.session as { [key: string]: any })["user"];
    if (user) {
        res.locals.user = user;
        return next();
    }
    res.status(403).send('You have to bee auth');
}

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    const admin = res.locals.user;
    if (admin == true) return next();
    res.status(403).send('you are not authorized to access this resource');
} 