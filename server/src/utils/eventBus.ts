import { IMessage } from "../interfaces/IMessage";
import { INotification } from "../interfaces/INotification";

type EventMap = {
  "appointment-notification": { userId: string; notification: INotification };
  "new-message": { message: IMessage };
  "consultation-completed": { appointmentId: string };
};

type EventName = keyof EventMap;

class EventBus {
  private listeners: {
    [K in EventName]?: Array<(data: EventMap[K]) => void>;
  } = {};

  subscribe<K extends EventName>(
    event: K,
    callback: (data: EventMap[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
  }

  publish<K extends EventName>(event: K, data: EventMap[K]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}

export const eventBus = new EventBus();
