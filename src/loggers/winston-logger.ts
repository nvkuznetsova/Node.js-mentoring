import winston from 'winston';

export const winstonLogger = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss |',
                }),
                winston.format.printf(
                    (error) =>
                        `${error.timestamp} ${error.level}: ${error.message} Stack: ${error.stack}`
                )
            ),
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});
