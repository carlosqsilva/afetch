import { getURL } from "./getURL";
import { mergeConfig } from "./mergeConfig";

interface Headers {
  [key: string]: any;
  common?: { [key: string]: string };
}

export type Method = "GET" | "PUT" | "POST" | "DELETE";

export interface BasicAuth {
  user: string;
  pass: string;
}

export interface RequestInstance {
  baseURL: string;
  headers?: Headers;
  getHeaders?: (
    method: Method,
    partialUrl: string
  ) => { [key: string]: string };
  auth?: BasicAuth | ((method: Method, partialUrl: string) => BasicAuth);
}

export interface RequestConfig extends RequestInit {
  method: Method;
  partialURL: string;
  params?: any;
  data?: any;
  auth?: BasicAuth | ((method: Method, partialUrl: string) => BasicAuth);
}

export function createRequest(instanceConfig: RequestInstance) {
  if (!self?.fetch) {
    throw new Error("browser not supported");
  }

  function request(config: RequestConfig) {
    const url = getURL({
      baseURL: instanceConfig.baseURL,
      partialURL: config.partialURL,
      params: config.params
    });

    const requestData = mergeConfig(instanceConfig, config);

    return self.fetch(url, requestData).then(handleResponse);
  }

  return {
    GET: (partialURL: string, data?: RequestConfig) =>
      request({ ...data, partialURL, method: "GET" }),

    PUT: (partialURL: string, data?: RequestConfig) =>
      request({ ...data, partialURL, method: "PUT" }),

    POST: (partialURL: string, data?: RequestConfig) =>
      request({ ...data, partialURL, method: "POST" }),

    DELETE: (partialURL: string, data?: RequestConfig) =>
      request({ ...data, partialURL, method: "DELETE" })
  };
}

function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}
