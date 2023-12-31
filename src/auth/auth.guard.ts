import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Reflector} from "@nestjs/core";
import {Request} from "express";
import {IS_PUBLIC_KEY} from "./decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * @param jwtService
     * @param configService
     * @param reflector
     */
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private reflector: Reflector
    ) {}

    /**
     * check the access of the routes
     * if route is public return true
     * @param context
     * @return Promise<boolean>
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic:boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token:string = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            request["user"] = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>("JWT_SECRET_KEY"),
            });
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    /**
     * extract auth token from the header
     * @param request
     * @private
     * @return auth token
     */
    private extractTokenFromHeader(request: Request): string{
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
