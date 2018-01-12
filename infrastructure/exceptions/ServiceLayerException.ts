import {IApplicationException} from "./ApplicationException";

export class ServiceLayerException extends Error implements IApplicationException  {
    public name: string;
    public message: string;
    public data: string;

    constructor(message: string, data?: any) {
        super("SERVICE_LAYER_EXCEPTION");
        this.name = "SERVICE_LAYER_EXCEPTION";
        this.message = message;
        this.data = data;
    }
}
