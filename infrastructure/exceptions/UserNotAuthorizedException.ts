import {IApplicationException} from "./ApplicationException";

export class UserNotAuthorizedException extends Error implements IApplicationException  {
    public name: string;
    public message: string;
    public data: string;

    constructor(username: string, action: string) {
        super("USER_NOT_AUTHORIZED");
        this.name = "USER_NOT_AUTHORIZED";
        this.message = "USER_" + username.toUpperCase() + "_IS_NOT_AUTHORIZED_FOR_" + action.toUpperCase();
        this.data = "USER_" + username.toUpperCase() + "_IS_NOT_AUTHORIZED_FOR_" + action.toUpperCase();
    }
}
