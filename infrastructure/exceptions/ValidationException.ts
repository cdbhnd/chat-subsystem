import {IApplicationException} from "./ApplicationException";

export class ValidationException extends Error implements IApplicationException {
    public name: string;
    public message: string;
    public data: any;

    constructor(data, message?) {
        super("VALIDATION_FAILED");
        this.name = "VALIDATION_FAILED";
        this.data = data;
        this.message = !!message ? message : "Validaton failed.";
    }
}
