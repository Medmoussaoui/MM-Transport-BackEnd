import { Express, NextFunction, Request, Response } from "express";

export function expressErrorHandler(app: Express) {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        // 404 Page Not Found Can Implement it here
        res.status(400).send("bad request");
    });
}