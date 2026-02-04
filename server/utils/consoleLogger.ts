import winston from 'winston';
import * as colorette from 'colorette';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const colors: Record<string, (text: string | number) => string> = {
    error: colorette.red,
    warn: colorette.yellow,
    info: colorette.green,
    http: colorette.magenta,
    verbose: colorette.cyan,
    debug: colorette.blue,
    silly: colorette.magenta,
};

const customFormat = winston.format.printf((info) => {
    const { level, message, ms, stack } = info;
    const colorizer = colors[level] || colorette.white;
    const levelLabel = colorizer(`${level}:`).padEnd(10);

    const timeDiff = ms ? ` ${colorette.gray(`+${ms}`)}` : '';
    let logMessage = `${levelLabel} ${colorette.gray('[')} ${message}${timeDiff}`;

    if (stack) {
        logMessage += `\n${levelLabel} ${colorette.gray('[')} ${colorette.gray(String(stack))}`;
    }

    return logMessage;
});

export const logger = winston.createLogger({
    levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        customFormat
    ),
    transports: [
        new winston.transports.Console()
    ],
});

// Helper to provide a nicer API similar to the requested style
export const log = {
    info: (msg: string) => logger.info(msg),
    error: (msg: string, stack?: string) => logger.error(msg, { stack }),
    warn: (msg: string) => logger.warn(msg),
    debug: (msg: string) => logger.debug(msg),
    silly: (msg: string) => logger.silly(msg),
};
