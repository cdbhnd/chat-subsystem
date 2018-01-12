import { ValidationException } from "../infrastructure/exceptions";
import  indicative = require("indicative");

const booleanCheck =  (value, options: [any]) => {
    return value == "true" ? true : false;
};

indicative.sanitizor.extend("booleanCheck", booleanCheck);

export async function sanitize(params: any, sanitizationRules: any) {
    try {
        const sanitizedData = await indicative.sanitize(params, sanitizationRules);
        return sanitizedData;
    } catch (error) {
        throw new ValidationException(error, "Sanitizaion failed.");
    }
}
