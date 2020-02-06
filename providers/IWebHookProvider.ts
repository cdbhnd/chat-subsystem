export interface IWebHookProvider {
    invoke(url: string, payload: any);
}
