export async function corsMiddleware(req: any, res: any, next: Function) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, PATCH, DELETE");
    next();
}
