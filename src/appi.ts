import * as appInsights from 'applicationinsights';

export const loadAppInsights = async () => {
  appInsights
    .setup(process.env['APPLICATIONINSIGHTS_CONNECTION_STRING'])
    .setAutoCollectConsole(true)
    .setAutoCollectDependencies(true)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectHeartbeat(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectRequests(true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .setSendLiveMetrics(true)
    .setUseDiskRetryCaching(true);
  appInsights.defaultClient.context.tags[
    appInsights.defaultClient.context.keys.cloudRole
  ] = process.env['APPLICATIONINSIGHTS_ROLE_NAME'];

  appInsights.start();
};
