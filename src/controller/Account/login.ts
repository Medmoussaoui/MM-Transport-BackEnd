import { mysqldb } from "../../core/config/knex.db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../startup/config";
import { Request, Response } from "express";

export class LoginController {
    req: Request;
    res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    invalidInput() {
        this.res.status(401).send("username and password are required");
    }

    usernameOrPasswordInvalid() {
        this.res.status(401).send("username or password is invalid");
    }

    validateInput(): boolean {
        const { username, password } = this.req.body;
        return username != undefined && password != undefined;
    }

    async verifyCredential(): Promise<any> {
        const { username, password } = this.req.body;
        let select = await mysqldb("Drivers").select("*").where({ username });
        if (select.length < 0) return;

        const user = select[0];
        // let correctPassword = await bcrypt.compare(this.password!, user.password);
        // if (correctPassword) return user;
        if (user.password == password) return user;
        return;
    }

    userToJwtObject(user: any): {} {
        return {
            driverId: user.driverId,
            username: user.username,
            driverName: user.driverName,
            isAdmin: user.isAdmin,
        }
    }

    generateAccessToken(user: any): string {
        return jwt.sign(user, config.get('jwt-secretkey'),)
    }


}