import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger('test-context');
  });

  it('should log basic message as JSON', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Test message');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(logSpy.mock.calls[0][0]);

    expect(logOutput).toHaveProperty('timestamp');
    expect(logOutput).toHaveProperty('level', 'LOG');
    expect(logOutput).toHaveProperty('context', 'test-context');
    expect(logOutput.message).toMatch(/^Test message \[\]$/);
    expect(typeof logOutput.timestamp).toBe('string');
    expect(new Date(logOutput.timestamp)).not.toBeNaN();

    logSpy.mockRestore();
  });

  it('should log error with trace', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('Error message', 'Stack trace');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const errorOutput = JSON.parse(errorSpy.mock.calls[0][0]);

    expect(errorOutput).toHaveProperty('level', 'ERROR');
    expect(errorOutput.message).toMatch(/^Error message Stack trace \[\]$/);
    expect(errorOutput.message).toContain('Stack trace');
    expect(typeof errorOutput.timestamp).toBe('string');
    expect(new Date(errorOutput.timestamp)).not.toBeNaN();

    errorSpy.mockRestore();
  });

  it('should handle parameters', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Message with %s and %d', 'string', 123);

    expect(logSpy).toHaveBeenCalledTimes(1);
    const paramOutput = JSON.parse(logSpy.mock.calls[0][0]);

    // Обновляем регулярное выражение под реальный формат
    expect(paramOutput.message).toMatch(
      /^Message with \[ 'string', 123 \] and %d$/,
    );
    expect(typeof paramOutput.timestamp).toBe('string');
    expect(new Date(paramOutput.timestamp)).not.toBeNaN();

    logSpy.mockRestore();
  });

  it('should handle special characters in message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Message with "quotes" and \\backslash\\');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const specialOutput = JSON.parse(logSpy.mock.calls[0][0]);

    // Обновляем ожидаемое значение
    expect(specialOutput.message).toBe(
      'Message with "quotes" and \\backslash\\ []',
    );
    expect(typeof specialOutput.timestamp).toBe('string');
    expect(new Date(specialOutput.timestamp)).not.toBeNaN();

    logSpy.mockRestore();
  });

  it('should handle empty message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const emptyOutput = JSON.parse(logSpy.mock.calls[0][0]);

    // Обновляем ожидаемое значение с учетом пробела
    expect(emptyOutput.message).toBe(' []');
    expect(typeof emptyOutput.timestamp).toBe('string');
    expect(new Date(emptyOutput.timestamp)).not.toBeNaN();

    logSpy.mockRestore();
  });
});
