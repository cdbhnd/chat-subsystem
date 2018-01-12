import { validate } from "../utility/Validator";
import * as Exceptions from "../infrastructure/exceptions/";
import { sanitize } from "../utility/Sanitizor";
import { injectable } from "inversify";

export interface IAction {
    run(context?: ActionContext): Promise<any>;
}

@injectable()
export abstract class ActionBase<TOut> implements IAction {

    public run = async (context?: ActionContext): Promise<TOut> => {

        if (typeof (context) === "undefined") {
            return await this.execute();
        }

        await validate(context.params, this.getConstraints(context.params));

        context.params = await sanitize(context.params, this.getSanitizationPattern());

        try {
            context = await this.onActionExecuting(context);

            let result = await this.execute(context);

            const subActions: Array<ActionBase<TOut>> = this.subActions();

            for (let i = 0; i < subActions.length; i++) {
                result = await subActions[i].execute(context);
            }

            const resultPrepared = await this.onActionExecuted(result);

            return resultPrepared;
        } catch (e) {
            let errorContext: ErrorContext<TOut> = new ErrorContext<TOut>();
            errorContext.context = context;
            errorContext.exception = e;
            errorContext.handled = false;

            errorContext = await this.onError(errorContext);

            if (errorContext.handled) {
                return errorContext.result;
            }

            throw (e);
        }
    }

    public abstract execute(context?: ActionContext): Promise<TOut>;
    protected abstract getConstraints(params: any): any;
    protected abstract getSanitizationPattern(): any;

    protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
        return context;
    }

    protected async onActionExecuted(result: TOut): Promise<TOut> {
        return result;
    }

    protected async onError(errorContext: ErrorContext<TOut>): Promise<ErrorContext<TOut>> {
        return errorContext;
    }

    protected subActions(): Array<ActionBase<TOut>> {
        return new Array<ActionBase<TOut>>();
    }
}

export class ActionContext {
    public params: any;
    public query: any;
    constructor(params?: any, query?: any) {
        this.params = params;
        this.query = query;
    }
}

export class ErrorContext<T> {
    public context: ActionContext;
    public exception: Exceptions.IApplicationException;
    public handled: boolean;
    public result: T;
}
