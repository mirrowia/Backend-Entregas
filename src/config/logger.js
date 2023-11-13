const winston = require('winston');
const {createLogger, format, transports} = winston;

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
      },
      colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'gray',
        debug: 'black',
      }
}

// DEVELOPER LOGGER
const devLogger = createLogger({
    levels: customLevelsOptions.levels,
    level: 'debug',
    format: format.combine(
        format.colorize({colors: customLevelsOptions.colors}),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.simple()
    ),
    transports: [
        new transports.Console(),
    ]
})

// PRODUCTION LOGGER
const productionLogger = createLogger({
    levels: customLevelsOptions.levels,
    level: "info",
    format: format.combine(
        format.colorize({colors: customLevelsOptions.colors}),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.simple()
    ),
    transports: [
        new transports.File({
            filename: "./src/logs/errors.log",
            level: "error", 
            format: format.combine(
                format.simple()
            ),
        })
    ]
})



const logger = process.env.NODE_ENV === "PRODUCTION" ? productionLogger : devLogger;

module.exports = logger;