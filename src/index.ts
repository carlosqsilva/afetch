import { getURL } from "./getURL";
import { mergeConfig } from "./mergeConfig";

interface Headers {
  [key: string]: any;
  common?: { [key: string]: string };
}

export interface RequestInstance {
  baseURL: string;
  headers?: Headers;
}

export interface RequestConfig extends RequestInit {
  params?: any;
  data?: any;
}

export function createRequest(instanceConfig: RequestInstance) {
  if (!self?.fetch) {
    throw new Error("browser not supported");
  }

  function request(partialURL: string, config: RequestConfig) {
    const { baseURL } = instanceConfig;

    const url = getURL({
      baseURL,
      partialURL,
      params: config?.params
    });

    const requestData = mergeConfig(instanceConfig, config);

    return self.fetch(url, requestData).then(handleResponse);
  }

  return {
    GET: (url: string, data?: RequestConfig) =>
      request(url, { ...data, method: "GET" }),

    PUT: (url: string, data?: RequestConfig) =>
      request(url, { ...data, method: "PUT" }),

    POST: (url: string, data?: RequestConfig) =>
      request(url, { ...data, method: "POST" }),

    DELETE: (url: string, data?: RequestConfig) =>
      request(url, { ...data, method: "DELETE" })
  };
}

function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}
