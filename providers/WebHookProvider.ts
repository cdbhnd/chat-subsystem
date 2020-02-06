import { IWebHookProvider } from "./IWebHookProvider";
import rp = require("request-promise");
import { injectable } from "inversify";

@injectable()
export class WebHookProvider implements IWebHookProvider {

    public async invoke(url: string, payload: any) {

        return new Promise<any>((resolve, reject) => {
            const options = {
                url: url,
                method: "POST",
                body: payload,
                json: true,
            };

            rp(options)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });

        });
    }
}
