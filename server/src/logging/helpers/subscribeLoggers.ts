import { LogEvent } from "../../common/enums";
import { EventManager } from "../EventManager";
import { LoggerConsole } from "../LoggerConsole";
import { LoggerFile } from "../LoggerFile";

const eventManager = new EventManager();
const loggerToFile = new LoggerFile();
const loggerToConsole = new LoggerConsole();

const subscribeLoggers = (): void => {
  eventManager.subscribe(
    [LogEvent.INFO, LogEvent.WARNING, LogEvent.ERROR],
    loggerToFile
  );
  eventManager.subscribe([LogEvent.ERROR], loggerToConsole);
};

export { eventManager, subscribeLoggers, loggerToFile, loggerToConsole };
