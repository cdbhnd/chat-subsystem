import {IApplicationException} from "./ApplicationException";

export class InvalidCredentialsException extends Error implements IApplicationException {
    public encryptedPassword: string;
    public username: string;
    public data: string;

    constructor(username, encryptePassword, message?, data?) {
        super("INVALID_CREDENTIALS");
        this.name = "INVALID_CREDENTIALS";
        this.username = username;
        this.encryptedPassword = encryptePassword;
        this.message = !!message ? message : "INVALID_CREDENTIALS";
        this.data = data;
    }
}
