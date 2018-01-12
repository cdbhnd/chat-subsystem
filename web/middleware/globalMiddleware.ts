import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class GlobalMiddleware implements ExpressMiddlewareInterface {

   public use(request: any, response: any, next?: (err?: any) => any): any {
        // tslint:disable-next-line:no-string-literal
        global["response_reference"] = response;
        next();
    }
}
