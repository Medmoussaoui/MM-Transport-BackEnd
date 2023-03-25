import { Request, Response } from "express";
import { LoginController } from "./login";


export class AccountController {

    async login(req: Request, res: Response) {
        let controller = new LoginController(req.body.username, req.body.password);

        if (!controller.validateInput()) return controller.invalidInput(res);

        const user = await controller.verifyCredential();

        if (user == undefined) return controller.usernameOrPasswordInvalid(res);
        
        const userJwt = controller.userToJwtObject(user);
        const accessToken = controller.generateAccessToken(userJwt);
        
        res.header("access-token", accessToken);
        res.status(200).send("You are logged");
    }

    changePassword(req: Request, res: Response) {

    }
}