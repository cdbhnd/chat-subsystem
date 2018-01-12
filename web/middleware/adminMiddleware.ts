import { ExpressMiddlewareInterface } from "routing-controllers";

export class AdminMiddleware implements ExpressMiddlewareInterface {

  public async use(request: any, response: any, next?: (err?: any) => any): Promise<any> {

    if (!request.headers.c_admin_key) {
      return response.status(401).end();
    }

    try {
      request.params.userId = request.headers.c_admin_key;
    } catch (err) {
      return response.status(401).end();
    }

    next();
  }
}
