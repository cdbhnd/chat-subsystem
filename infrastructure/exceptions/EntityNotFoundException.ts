import {IApplicationException} from "./ApplicationException";

export class EntityNotFoundException extends Error implements IApplicationException  {
    public entity: string;
    public identifier: string;
    public name: string;
    public message: string;
    public data: string;

    constructor(entity, identifier, message?, data?) {
        super("ENTITY_NOT_FOUND");
        this.name = "ENTITY_NOT_FOUND";
        this.entity = entity;
        this.identifier = identifier;
        this.message = !!message ? message : entity.toString().toUpperCase() +  "_ENTITY_NOT_FOUND";
        this.data = data;
    }
}
