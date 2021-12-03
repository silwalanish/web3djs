enum LogLevel {
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  INFO = 'INFO'
}

function log(level: LogLevel, msg: any): void {
  const logMsg = `${level}: ${msg}`;
  switch (level) {
    case LogLevel.ERROR:
      console.error(logMsg);
      break;
    default:
      console.log(logMsg);
      break;
  }
}

export function info(msg: any): void {
  log(LogLevel.INFO, msg);
}

export function debug(msg: any): void {
  log(LogLevel.DEBUG, msg);
}

export function error(msg: any): void {
  log(LogLevel.ERROR, msg);
}
