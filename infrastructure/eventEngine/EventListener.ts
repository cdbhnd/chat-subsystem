import {EventAggregator} from "../../infrastructure/eventEngine/EventAggregator";

export function EventListener(event: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const originalMethod = descriptor.value;

        const eventMediator = EventAggregator.getMediator();
        eventMediator.subscribe(event, originalMethod);
    };
}
