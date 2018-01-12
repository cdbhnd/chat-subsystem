export interface IEventMediator {
    /**
     *
     * @param {string} eventName
     * @param {Function} callback
     * @returns {string} identifier of subscription
     *
     * @memberOf IEventMediator
     */
    subscribe(eventName: string, callback: (event, data) => void): string;

    /**
     *
     * @param {string} identifier
     *
     * @memberOf IEventMediator
     */
    unsubscribe(identifier: string): void;
    /**
     * @param {string} eventName
     * @param {*} data
     *
     * @memberOf IEventMediator
     */
    boradcastEvent(eventName: string, data: any): void;

    /**
     *
     * @param {string} eventName
     * @param {*} data
     *
     * @memberOf IEventMediator
     */
    broadcastEventToHooks(eventName: string, data: any): void;
}
