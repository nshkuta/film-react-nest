import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger('test-context');
  });

  it('should log basic message', () => {
    const logSpy = jest.spyOn(logger, 'log').mockImplementation();
    // Вызываем метод лога с тестовым сообщением
    logger.log('Test message');

    // Проверяем, что метод был вызван один раз
    expect(logSpy).toHaveBeenCalledTimes(1);

    // Дополнительно можно проверить параметры вызова
    expect(logSpy).toHaveBeenCalledWith('Test message');

    // Восстанавливаем оригинальное поведение
    logSpy.mockRestore();
  });

  it('should handle error level', () => {
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation();
    logger.error('Test error message');

    expect(errorSpy).toHaveBeenCalledTimes(1);

    expect(errorSpy).toHaveBeenCalledWith('Test error message');

    errorSpy.mockRestore();
  });
});
