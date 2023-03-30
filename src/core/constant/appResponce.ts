import { Response } from "express"

export class AppResponce {
    static serverFailure = (res: Response, err?: any) => {
        if (err != undefined) {
            // logger.error("we need to increse the memory because we expect to get more users", err);
        }
        return res.status(500).send("sorry, the server has problem to process this request now please try again later");
    }

    static badRequest(res: Response, err?: any) {
        res.status(400).send("Bad Request");
    }
}