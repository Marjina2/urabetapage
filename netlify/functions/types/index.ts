export interface HandlerEvent {
  body: string | null;
  headers: { [key: string]: string };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  queryStringParameters: { [key: string]: string } | null;
  rawUrl: string;
}

export interface HandlerContext {
  awsRequestId: string;
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  remainingTimeInMillis: number;
}

export type Handler = (
  event: HandlerEvent,
  context: HandlerContext
) => Promise<{
  statusCode: number;
  body: string;
  headers?: { [header: string]: string | number | boolean };
}>; 