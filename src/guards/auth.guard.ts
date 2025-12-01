import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) { }
    
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const authHeader = req.headers.authorization;

        if (!authHeader) throw new UnauthorizedException('Token missing');

        const token = authHeader.split(" ")[1];

        try {
            const payload = this.jwtService.verifyAsync(token)

            req['user'] = payload;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}