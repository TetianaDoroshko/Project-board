import { LogFile } from "../common/enums/logs.enum";
import { EventData, EventType, ISubscriber } from "../common/types/eventTypes";
import { List } from "../data/models/list";

class LoggerConsole implements ISubscriber {
  private date() {
    return new Date().toLocaleDateString();
  }

  private time() {
    return new Date().toLocaleTimeString();
  }

  // for PATTERN:{Observer}
  update(eventType: EventType, data: EventData) {
    const logString = `${this.time()} ${this.date()} - client ${
      data.client
    } - ${data.action} ${data.entity}  \n`;

    console.log(LogFile.INFO, logString);
  }

  // for PATTERN:{Proxy}
  log(items: any, ...args: any[]) {
    const logString = `${this.time()} ${this.date()} - ${args.join(", ")}  \n`;
    console.log(logString);
  }
}

export { LoggerConsole };
