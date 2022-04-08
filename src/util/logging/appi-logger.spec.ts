import { AppInsightsLogger } from './appi-logger';

describe('AppInsightsLogger', () => {
  it('should be defined', () => {
    expect(new AppInsightsLogger('test')).toBeDefined();
  });
});
