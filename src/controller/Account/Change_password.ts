
import { Request, Response } from "express";
import { DriversModule } from "../../module/drivers.model";
import { getDriverUserName } from "../../core/functions/get_driver_username";

export class changePasswordController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    currentPasswordWrong(): void {
        this.res.status(401).send("Current Passwrd is uncorrect");
    }

    passwordNotMatched(): void {
        this.res.status(401).send("password Not Matched");
    }

    validateInput(): boolean {
        const { currentPassword, newPassword } = this.req.body;
        if (currentPassword == undefined || currentPassword == "") return false;
        if (newPassword == undefined || newPassword == "") return false;
        if((newPassword as string).length < 4) return false;
        return true;
    }

    async verifyCurrentPassword(): Promise<boolean> {
        const { currentPassword } = this.req.body;
        const username = getDriverUserName(this.res);
        let select = await DriversModule.getDriverByUsername(username);
        const user = select[0];

        return user.password == currentPassword;
    }

    async change(): Promise<void> {
        const { newPassword } = this.req.body;
        const username = getDriverUserName(this.res);
        await DriversModule.updatePassword(newPassword, username);
    }

}