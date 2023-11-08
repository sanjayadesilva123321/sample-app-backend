import {Injectable} from "@nestjs/common";
import {Response} from "express";

@Injectable()
export class MainService {
    /**
     * Send response to client using defined format.
     * @param res
     * @param message
     * @param data
     * @param success
     * @param code
     * @param responseCode
     */
    public sendResponse(
        res: Response,
        message: string,
        data: any,
        success: boolean,
        code: number,
        responseCode: number = null
    ): object {
        return res.status(code).send({
            code: responseCode ? responseCode : code,
            data,
            message,
            success,
        });
    }
}
