enum LogFile {
  INFO = "src/logging/journal/info.log.txt",
  WARNING = "src/logging/journal/warnings.log.txt",
  ERROR = "src/logging/journal/error.log.txt",
}

enum LogEvent {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export { LogFile, LogEvent };
