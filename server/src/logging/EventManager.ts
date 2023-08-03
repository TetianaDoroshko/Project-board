import {
  EventData,
  EventType,
  ObserversType,
} from "../common/types/eventTypes";

class EventManager {
  observers: ObserversType;

  constructor() {
    this.observers = { info: [], warning: [], error: [] };
  }

  subscribe(eventTypes: EventType[], subscriber) {
    eventTypes.forEach((eventType) =>
      this.observers[eventType].push(subscriber)
    );
  }

  unsubscribe(eventTypes: EventType[], subscriber): void {
    eventTypes.forEach((eventType) => {
      this.observers[eventType] = this.observers[eventType].filter(
        (element) => element !== subscriber
      );
    });
  }

  notify(eventType: EventType, data: EventData): any {
    this.observers[eventType].forEach((observer) =>
      observer.update(eventType, data)
    );
  }
}

export { EventManager };
