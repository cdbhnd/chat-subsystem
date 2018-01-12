import { IAction } from "../../actions/";
import { kernel, Types } from "../../infrastructure/dependency-injection/index";

export function UseAction(name: string) {

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>)  => {

        const originalMethod = descriptor.value;

        // Decore the original function with error try/catch
        descriptor.value =  (...args: any[]) => {
            const action: IAction = kernel.getNamed<IAction>(Types.IAction, name);
            args.push(action);
            return originalMethod
                .apply(this, args);
        };

        return descriptor;
    };
}
