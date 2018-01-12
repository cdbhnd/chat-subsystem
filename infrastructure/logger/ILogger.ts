export interface ILogger {
    createHttpLog(log: IHttpLogEntry): void;
    createErrorLog(log: any): void;
}

export interface IHttpLogEntry {
    createdAt: Date;
    request: ILogRequest;
    response: ILogResponse;
}
interface ILogResponse {
    headers: any;
    statusCode: number;
    body: any;
}
interface ILogRequest {
    headers: any;
    method: string;
    url: string;
    params: any;
    query: string;
    body: any;
}
