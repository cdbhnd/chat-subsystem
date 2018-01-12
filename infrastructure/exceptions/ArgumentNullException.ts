import {IApplicationException} from "./ApplicationException";

export class ArgumentNullException extends Error implements IApplicationException  {
    public name: string;
    public message: string;
    public data: string;

    constructor(argument: string) {
        super("ARGUMENT_CAN_NOT_BE_NULL");
        this.name = "ARGUMENT_CAN_NOT_BE_NULL";
        this.message = argument.toUpperCase() + "_ARGUMENT_CAN_NOT_BE_NULL";
        this.data = argument;
    }
}
