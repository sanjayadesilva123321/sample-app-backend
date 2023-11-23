import {Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { jwtDecode } from "jwt-decode";
import jwt = require("jsonwebtoken");

@Injectable()
export class HelpersService {
    /**
     * @param configService
     * @param logger
     */
    constructor(private readonly configService: ConfigService, private readonly logger: Logger) {}

    /**
     * Decode JWT Code and get Values
     * @param token
     * @return decoded token or null
     */
    public async decodeJWTToken(token: string | undefined) :Promise<string> {
        try {
            const refactoredToken :string = token ? token.replace("Bearer ", "") : "";
            if (refactoredToken === "") {
                return null;
            } else {
                return jwtDecode(refactoredToken);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                this.logger.error( "Error in helper service -decodeJWTToken: " + error);
                throw new Error(error.message);
            }
        }
    }

    /**
     * Verify JWT web token
     * @param token
     * @return array jwtPayload or error
     */
    public async verifyJWTWebToken(token: any):Promise<any[]> {
        try {
            const refactoredToken = token ? token.replace("Bearer ", "") : "";
            const response = jwt.verify(refactoredToken, this.configService.get<string>("ROLE_TOKEN_SECRET"));
            return [null, response];
        } catch (error: any) {
            this.logger.error("Error in helper service -verifyJWTWebToken: " + error);
            return [error, null];
        }
    }
}
