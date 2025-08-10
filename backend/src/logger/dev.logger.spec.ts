import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger('test-context');
  });

  it('should log basic message', () => {
    const logSpy = jest.spyOn(logger, 'log').mockImplementation();
    logger.log('Test message');

    expect(logSpy).toHaveBeenCalledTimes(1);

    expect(logSpy).toHaveBeenCalledWith('Test message');

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
