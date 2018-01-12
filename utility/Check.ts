import { ArgumentNullException } from "../infrastructure/exceptions/ArgumentNullException";

export class Check {
    public static notNull(param: any, paramName: string) {

        if (!param) {
            throw new ArgumentNullException(paramName);
        }
    }
}
