import { Request, Response } from "express";
import { KeywordsModule } from "../../module/keywords.model";

export class ServiceKeywordsController {
    async boatNameKeywords(req: Request, res: Response) {
        let boatName = req.params.boatName;
        let keywords = await KeywordsModule.boatNameMarchKeywords(boatName);
        res.send(keywords);
    }

    async serviceTypeKeywords(req: Request, res: Response) {
        let serviceType = req.params.serviceType;
        let keywords = await KeywordsModule.serviceTypeMatchKeywords(serviceType);
        res.send(keywords);
    }
}