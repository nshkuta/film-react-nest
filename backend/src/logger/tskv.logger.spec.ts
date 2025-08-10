import { TSKVLogger } from './tskv.logger';

describe('TSKVLogger', () => {
  let logger: TSKVLogger;

  beforeEach(() => {
    logger = new TSKVLogger('test-context');
  });

  it('should log basic message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Test message');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const logOutput = logSpy.mock.calls[0][0];

    expect(logOutput).toContain('timestamp=');
    expect(logOutput).toContain('logId=');
    expect(logOutput).toContain('level=LOG');
    expect(logOutput).toContain('context=test-context');
    expect(logOutput).toContain('message=Test message');

    logSpy.mockRestore();
  });

  it('should log error with trace', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('Error occurred', 'Stack trace');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const errorOutput = errorSpy.mock.calls[0][0];

    expect(errorOutput).toContain('level=ERROR');
    expect(errorOutput).toContain('message=Error occurred');
    expect(errorOutput).toContain('Stack trace');

    errorSpy.mockRestore();
  });

  it('should handle parameters', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Message with %s and %d', 'string', 123);

    expect(logSpy).toHaveBeenCalledTimes(1);
    const paramOutput = logSpy.mock.calls[0][0];

    expect(paramOutput).toContain(
      "message=Message with [ 'string', 123 ] and %d",
    );
    expect(paramOutput).toContain('params=string,123');

    logSpy.mockRestore();
  });

  it('should handle trace correctly', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('Error message', 'Detailed trace information');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const output = errorSpy.mock.calls[0][0];

    expect(output).toContain('message=Error message');
    expect(output).toContain('Detailed trace information');

    errorSpy.mockRestore();
  });
});
