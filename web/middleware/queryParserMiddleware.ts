import { Parser } from "../../utility/Parser";

export async function QueryParserMiddleware(req: any, res: any, next: Function) {
    let radiusSerach;
    if (!!req.query.radiusSearch) {
        radiusSerach = JSON.parse(req.query.radiusSearch);
        delete req.query.radiusSearch;
    }

    const parser = new Parser();
    const query = req.query;
    if (!query) {
        return next();
    }
    req.params.query = parser.mongodb(query);

    if (!!radiusSerach) {
        req.params.query.radiusSearch = radiusSerach;
    }

    return next();
}
