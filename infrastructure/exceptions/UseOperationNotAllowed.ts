import {IApplicationException} from "./ApplicationException";

export class UseOperationNotAllowed extends Error implements IApplicationException {
    public name: string;
    public message: string;
    public data: string;

    constructor(name, message?, data?) {
        super("UseOperationNotAllowed");
        this.name = name;
        this.message = message;
        this.data = data;
    }
}
