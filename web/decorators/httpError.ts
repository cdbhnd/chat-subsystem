import {HttpActionErrorConfiguration} from "../errors/HttpActionErrorConfiguration";

export function HttpError(errorCode: number, exception: string) {

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>)  => {

        const originalMethod = descriptor.value;
        const actionErrConfig = HttpActionErrorConfiguration.getInstance();

        // Decore the original function with error try/catch
        descriptor.value =  (...args: any[]) => {

            return originalMethod
                .apply(this, args)
                .then((data) => {
                    return data;
                }).catch((err) => {

                    // tslint:disable-next-line:no-string-literal
                    const response = global["response_reference"];

                    if (!!response) {
                        const exceptionName = !!err.constructor && !!err.constructor.name ? err.constructor.name : "UNKNOWN_EXCEPTION";
                        const currentErrorConfig = actionErrConfig.getFromConfigurations(exceptionName, propertyKey);
                        const code = !!currentErrorConfig ? currentErrorConfig.code : 500;
                        const message = !!currentErrorConfig ? err.message : "INTERNAL_SERVER_ERROR";
                        console.log(err);
                        return response.status(code).end(JSON.stringify({ message: message, details: err.data ? err.data : JSON.stringify(err) }));
                    }
                    return err;
                });
        };

        // Set HttpActionError in global http error registry
        actionErrConfig.setInConfigurations({
            code: errorCode,
            exception: exception,
            actionName: propertyKey,
        });

        return descriptor;
    };
}
