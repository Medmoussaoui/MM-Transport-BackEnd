import { NextFunction, Request, Response } from "express";
import { mysqldb } from "../core/config/knex.db.config";


export class syncReferenceMiddlewareController {

    getRef(req: Request): string {
        return req.header("requestId")!;
    }

    hasRequestId(req: Request): boolean {
        const ref = req.header("requestId");
        return ref != undefined;
    }

    async isAreadySynced(ref: string): Promise<boolean> {
        const query = await mysqldb("requestreferences").select("*")
            .where({ "requestId": ref });
        return query.length > 0;
    }

    endSync(res: Response): void {
        res.status(200).send("This is Aready synced");
    }

    static async setSyncReference(req: Request, res: Response) {
        const ref = req.header("requestId");
        if (ref == undefined) return;
        const driverId = res.locals.user.driverId;
        await mysqldb.insert({ userId: driverId, requestId: ref }).into("requestreferences");
    }

    middleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            
            if (!this.hasRequestId(req)) return next();
            const ref = this.getRef(req);
            const isSynced = await this.isAreadySynced(ref);
            if (isSynced) return this.endSync(res);
            next();
        }
    }

}