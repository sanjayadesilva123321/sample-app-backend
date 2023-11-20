import { Inject, Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from "./decorators/roles.decorator";
import { Role } from './role.enum';
import {HelpersService} from "../helpers/helpers.service";
import {MainService} from "../utils/main/main.service";
import {ResponseMessages} from "../configs/response.messages";
import {ResponseCode} from "../configs/response.codes";

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
  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const [jwtError] = await this.helperService.verifyJWTWebToken(request.headers["role-token"]);
    if (jwtError) {
        return this.mainService.sendResponse(
            context.switchToHttp().getResponse(),
            ResponseMessages.UNAUTHORIZED,
            {},
            false,
            ResponseCode.UNAUTHORIZED
        );
    } else {
        const rolePermissionsWrapper: any = await this.helperService.decodeJWTToken(request.headers["role-token"]);
        return requiredRoles.some((role) => rolePermissionsWrapper.roles?.includes(role));
    }
  }
}