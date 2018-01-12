import {IApplicationException} from "./ApplicationException";

export class UserAlreadyExist extends Error implements IApplicationException {
    public name: string;
    public message: string;
    public data: string;

    constructor(name, message?, data?) {
        super("UserAlreadyExist");
        this.name = name;
        this.message = message;
        this.data = data;
    }
}
