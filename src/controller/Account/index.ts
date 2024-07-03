import { Request, Response } from "express";
import { LoginController } from "./login";
import { changePasswordController } from "./Change_password";
import { AppResponce } from "../../core/constant/appResponce";


export class AccountController {

    async login(req: Request, res: Response) {
        let controller = new LoginController(req, res);

        if (!controller.validateInput()) return controller.invalidInput();

        const user = await controller.verifyCredential();

        if (user == undefined) {
            return controller.usernameOrPasswordInvalid();
        }

        const userJwt = controller.userToJwtObject(user);
        const accessToken = controller.generateAccessToken(userJwt);

        res.header("access-token", accessToken);
        res.status(200).send("You are logged");
    }

    async changePassword(req: Request, res: Response) {
        const controller = new changePasswordController(req, res);

        if (!controller.validateInput()) return AppResponce.badRequest(res);
        
        const validCurrentPassword = await controller.verifyCurrentPassword();
        if (!validCurrentPassword) return controller.currentPasswordWrong();

        await controller.change();
        res.send("Password changed");
    }
}