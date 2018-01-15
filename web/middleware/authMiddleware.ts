import {ExpressMiddlewareInterface } from "routing-controllers";
import * as config from "config";
import * as jwt from "jwt-simple";

const secret: string = String(config.get("secret"));

export class OrgAuthMiddleware implements ExpressMiddlewareInterface  {

    public async use(request: any, response: any, next?: (err?: any) => any): Promise<any> {

        if (!request.headers.authorization || !request.headers.c_api_key) {
            return response.status(401).end();
        }

        const authorizationString = request.headers.authorization.split(" ");

        if (authorizationString[0] == "API" && !!authorizationString[1]) {

            try {
                const decodedToken = jwt.decode(authorizationString[1], secret);
                if (!request.params) {
                    request.params = {};
                }
                request.params.orgKey = [decodedToken.authUserId, request.headers.c_api_key];
            } catch (err) {
                return response.status(401).end();
            }

        } else {
            return response.status(401).end();
        }

        next();
    }
}
