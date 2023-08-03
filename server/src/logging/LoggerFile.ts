import { LogFile } from "../common/enums/logs.enum";
import * as fs from "node:fs/promises";
import { EventData, EventType, ISubscriber } from "../common/types/eventTypes";

class LoggerFile implements ISubscriber {
  async update(eventType: EventType, data: EventData) {
    const date = () => new Date().toLocaleDateString();
    const time = () => new Date().toLocaleTimeString();
    const logString = `${time()} ${date()} - client ${data.client} - ${
      data.action
    } ${data.entity}  \n`;
    switch (eventType) {
      case "info":
        await fs.appendFile(LogFile.INFO, logString);
        break;
      case "warning":
        await fs.appendFile(LogFile.WARNING, logString);
        break;
      case "error":
        await fs.appendFile(LogFile.ERROR, logString);
        break;
      default:
        break;
    }
  }
}

export { LoggerFile };
