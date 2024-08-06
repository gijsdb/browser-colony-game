import { ref } from 'vue';

type EventCallback = (data: object) => void;

interface Events {
  [key: string]: EventCallback[];
}

interface EventBusI {
    events: Events;
  
    emit(event: string, data: object): void;
  
    on(event: string, callback: EventCallback): void;
  
    off(event: string, callback: EventCallback): void;
  }

export const eventBus = ref<EventBusI>({
    events: {},

    emit(event: string, data: object) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    },

    on(event: string, callback: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    off(event: string, callback: EventCallback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
});