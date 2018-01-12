export function TransformResponse(sourceModel: string, destModel: string) {

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>)  => {

        const originalMethod = descriptor.value;

        descriptor.value =  (...args: any[]) => {

            return originalMethod
                .apply(this, args)
                .then((data) => {
                    return automapper.map(sourceModel, destModel, data);
                });
        };

        return descriptor;
    };
}
