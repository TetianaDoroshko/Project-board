export type EventType = "info" | "warning" | "error";

export type ObserversType = {
  info: ISubscriber[];
  warning: ISubscriber[];
  error: ISubscriber[];
};

export type EventData = {
  client: string;
  action: string;
  entity: string;
};

export interface ISubscriber {
  update(eventType: EventType, data: EventData): void;
}
