import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {

    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        try {
            /*const token = request.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;*/
            const jwt = request.cookies['jwt'];
            const { scope } = await this.jwtService.verify(jwt);
            
            const is_ambassador = request.path.toString().indexOf('api/ambassador') >= 0;

            return is_ambassador && scope === 'ambassador' || !is_ambassador && scope === 'admin';

         } catch (error) { 
            return false;
        }
    }
}