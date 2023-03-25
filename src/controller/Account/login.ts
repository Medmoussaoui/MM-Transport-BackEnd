import { mysqldb } from "../../core/config/knex.db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../startup/config";
import { Response } from "express";

export class LoginController {
    username?: string;
    password?: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;

    }

    invalidInput(res: Response) {
        res.status(401).send("username and password are required");
    }

    usernameOrPasswordInvalid(res: Response) {
        res.status(401).send("username or password is invalid");
    }

    validateInput(): boolean {
        return this.username != undefined && this.password != undefined;
    }

    async verifyCredential(): Promise<any> {
        let select = await mysqldb("Drivers").select("*").where({ username: this.username });
        let user = select[0];

        if (user == undefined) return;

        // let correctPassword = await bcrypt.compare(this.password!, user.password);
        // if (correctPassword) return user;
        if (user.password == this.password) return user;
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