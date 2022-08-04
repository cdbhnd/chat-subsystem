import * as mongodb from "mongodb";
import * as config from "config";

export class DB {
    public static dbDriver = mongodb;
    public static db: any;

    public static async init(): Promise<boolean> {
        let connectionAuth = "";
        try {
            const user = config.get("mongoDbSettings.dbUser");
            const pass = config.get("mongoDbSettings.dbPassword");
            if (!!user && !!pass) {
                connectionAuth = config.get("mongoDbSettings.dbUser") + ":" + config.get("mongoDbSettings.dbPassword") + "@";
            }
        } catch (e) {
            console.log("NO DB AUTH");
        }
        DB.db = await DB.dbDriver.MongoClient.connect("mongodb://" + connectionAuth + config.get("mongoDbSettings.dbHost"));
        return true;
    }
}
