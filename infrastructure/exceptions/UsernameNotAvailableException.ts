import {IApplicationException} from "./ApplicationException";

export class UsernameNotAvailableException extends Error implements IApplicationException {
    public encryptedPassword: string;
    public username: string;
    public data: string;

    constructor(username, message?, data?) {
        super("USERNAME_UNAVAILABLE");
        this.name = "USERNAME_UNAVAILABLE";
        this.username = username;
        this.message = !!message ? message : "USERNAME_UNAVAILABLE";
        this.data = data;
    }
}
