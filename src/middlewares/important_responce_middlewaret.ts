import { NextFunction, Request, Response } from "express";
import { ImportantResponceModel } from "../module/important_responce_model";
import { getDriverId } from "../core/functions/get_driver_id";
import { ImportantResponceEntity } from "../module/entity/important_responce_entity";


export class ImportantResponceMiddleware {

    isImportant(req: Request): boolean {
        return req.header("important_request_id") != undefined;
    }

    getId(req: Request): string {
        return req.header("important_request_id")!;
    }

    middleware() {
        return async (req: Request, res: Response, next: NextFunction) => {

            if (!this.isImportant(req)) return next();

            const request_id = this.getId(req);

            const find = await this.findResponce(request_id);
            if (find.length <= 0) {
                this.cachImportantResponce(res, request_id);
                return next();
            }

            const oldResponce = find[0];
            const { status_code } = oldResponce;
            if (status_code == 200 || status_code == 201) {
                return this.responceBack(res, oldResponce);
            }

            this.updateResponce(res, request_id);
            next();
        }
    }


    async findResponce(id: string) {
        return await ImportantResponceModel.select(id);
    }

    async cachImportantResponce(res: Response, id: string) {
        const defaultSend = res.send;
        res.send = (body) => {
            ImportantResponceModel.insertOne({
                user_id: getDriverId(res),
                request_id: id,
                status_code: res.statusCode,
                responce: JSON.stringify(body)
            });
            res.send = defaultSend;
            return res.send(body);
        }
    }

    async updateResponce(res: Response, id: string) {
        const defaultSend = res.send;
        res.send = (body) => {
            ImportantResponceModel.updateOne({
                request_id: id,
                status_code: res.statusCode,
                responce: JSON.stringify(body),
            });
            res.send = defaultSend;
            return res.send(body);
        }
    }

    responceBack(res: Response, oldResponce: ImportantResponceEntity) {
        const body = JSON.parse(oldResponce.responce ?? "");
        return res.status(oldResponce.status_code!).send(body);
    }
}