import { LoggerData } from '../interfaces/logger-data';

export class Logger {
    public log(data: LoggerData) {
        const args = this.formatArgs(data);
        const method = `Method: ${data.method}`;
        const message = args.length
            ? `${method}, Arguments: ${args}`
            : `${method}, Arguments: -`;
        // tslint:disable-next-line: no-console
        console.log(message);
    }

    public error(errorData: LoggerData) {
        const args = this.formatArgs(errorData);
        const method = `Method: ${errorData.method}`;
        const message = args.length
            ? `${method}, Arguments: ${args}, Message: ${errorData.message}`
            : `${method}, Arguments: -, Message: ${errorData.message}`;
        // tslint:disable-next-line: no-console
        console.log(message);
    }

    private formatArgs(data: LoggerData): string {
        return Reflect.ownKeys(data.args).reduce(
            (argsData: string, key: string): string => {
                return `${argsData} ${key}: ${data.args[key]}`;
            },
            ''
        ) as string;
    }
}

export const logger = new Logger();
