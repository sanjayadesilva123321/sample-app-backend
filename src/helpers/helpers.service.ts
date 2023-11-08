import {Injectable, Logger} from "@nestjs/common";
//import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import jwt = require("jsonwebtoken");
import {ConfigService} from "@nestjs/config";

@Injectable()
export class HelpersService {
    constructor(private readonly configService: ConfigService, private readonly logger: Logger) {}

    /**
     * Decode JWT Code and get Values
     * @param token
     */
    public async decodeJWTToken(token: string | undefined) {
        try {
            const refactoredToken = token ? token.replace("Bearer ", "") : "";
            if (refactoredToken === "") {
                return null;
            } else {
                return jwtDecode(refactoredToken);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                this.logger.error( "Error in helper service1 : " + error);
                throw new Error(error.message);
            }
        }
    }

    /**
     * Verify JWT web token
     * @param token
     */
    public async verifyJWTWebToken(token: any) {
        try {
            const refactoredToken = token ? token.replace("Bearer ", "") : "";
            const response = await jwt.verify(refactoredToken, this.configService.get<string>("ROLE_TOKEN_SECRET"));
            return [null, response];
        } catch (error: any) {
            this.logger.error("Error in helper service2 : " + error);
            return [error, null];
        }
    }
}