import {Inject, Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from "./decorators/roles.decorator";
import { ROLE } from '../constant';
import {HelpersService} from "../helpers/helpers.service";
import {MainService} from "../utils/main/main.service";

@Injectable()
export class RolesGuard implements CanActivate {
    /**
     *
     * @param reflector
     * @param helperService
     * @param mainService
     */
    constructor(private reflector: Reflector,
    @Inject(HelpersService) private helperService: HelpersService,
    @Inject(MainService) private mainService: MainService) {}

    /**
     * validate user role in the role token has access to route
     * @param context
     * @return true if user role of the logged-in user has access to route
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: ROLE[] = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const [jwtError] = await this.helperService.verifyJWTWebToken(request.headers["role-token"]);
    if (jwtError) {
        throw new UnauthorizedException();
    } else {
        const rolePermissionsWrapper: any = await this.helperService.decodeJWTToken(request.headers["role-token"]);
        return requiredRoles.some((role) => rolePermissionsWrapper.roles?.includes(role));
    }
  }
}