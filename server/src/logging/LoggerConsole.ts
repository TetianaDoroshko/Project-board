import { LogFile } from "../common/enums/logs.enum";
import { EventData, EventType, ISubscriber } from "../common/types/eventTypes";

class LoggerConsole implements ISubscriber {
  update(eventType: EventType, data: EventData) {
    const date = () => new Date().toLocaleDateString();
    const time = () => new Date().toLocaleTimeString();
    const logString = `${time()} ${date()} - client ${data.client} - ${
      data.action
    } ${data.entity}  \n`;

    console.log(LogFile.INFO, logString);
  }
}

export { LoggerConsole };
