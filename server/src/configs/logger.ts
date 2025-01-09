import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", 
  format: format.combine(
    format.timestamp(), 
    format.errors({ stack: true }), 
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level}]: ${message} - ${stack}`
        : `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: "logs/error.log", level: "error" }), 
    // new transports.File({ filename: "logs/combined.log" }), 
  ],
});

export default logger;
 