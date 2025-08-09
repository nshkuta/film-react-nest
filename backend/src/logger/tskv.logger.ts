import { LoggerService, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'util';

@Injectable()
export class TSKVLogger implements LoggerService {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const timestamp = new Date().toISOString();
    const logId = uuidv4();
    const formattedMessage = this.formatMessageWithParams(
      message,
      optionalParams,
    );

    // Формируем пары ключ-значение
    const fields = {
      timestamp,
      logId,
      level,
      context: this.context,
      message: formattedMessage,
      ...(optionalParams.length > 0
        ? { params: optionalParams.join(', ') }
        : {}),
    };

    // Преобразуем в TSKV формат
    return Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
  }

  private formatMessageWithParams(message: any, params: any[]): string {
    if (params.length === 0) {
      return message;
    }
    return format(message, ...params);
  }

  log(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('LOG', message, optionalParams));
  }

  error(message: any, trace?: string, ...optionalParams: any[]): void {
    console.error(this.formatMessage('ERROR', message, trace, optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(this.formatMessage('WARN', message, optionalParams));
  }

  debug(message: any, ...optionalParams: any[]): void {
    console.debug(this.formatMessage('DEBUG', message, optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('VERBOSE', message, optionalParams));
  }
}
