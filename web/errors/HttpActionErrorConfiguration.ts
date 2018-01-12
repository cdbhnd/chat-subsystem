import { IHttpActionError } from "./HttpActionError";

export class HttpActionErrorConfiguration {

    public static getInstance(): HttpActionErrorConfiguration {

        if (!HttpActionErrorConfiguration.singleInstance) {
            HttpActionErrorConfiguration.singleInstance = new HttpActionErrorConfiguration();
        }

        return HttpActionErrorConfiguration.singleInstance;
    }

    private static singleInstance: HttpActionErrorConfiguration;
    ///////////////////////////////////////////////////////////////

    private registryArray: IHttpActionError[] = [];

    public setInConfigurations(actionError: IHttpActionError) {
        this.registryArray.push(actionError);
    }

    public getFromConfigurations(exception: string, actionName: string): IHttpActionError {
        for (let i = 0; i < this.registryArray.length; i++) {
            if (this.registryArray[i].exception == exception && this.registryArray[i].actionName == actionName) {
                return this.registryArray[i];
            }
        }
    }
}
