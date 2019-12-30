import { RequestConfig, RequestInstance } from "./index";
import {
  isFile,
  isBlob,
  isObject,
  isElement,
  isFormData,
  setContentType,
  addToHeader,
  isURLSearchParams,
  isFunction
} from "./utils";

export function mergeConfig(
  defaults: RequestInstance,
  config: RequestConfig
): RequestInit {
  const headers = new Headers({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded"
  });

  const { method, partialURL, params, data, auth, ...restConfig } = config;

  // Merge Header
  if (isObject(defaults?.headers)) {
    const { common } = defaults.headers;

    if (isObject(common)) {
      addToHeader(headers, common);
    }

    const methodHeader = defaults.headers[method.toLowerCase()];

    if (isObject(methodHeader)) {
      addToHeader(headers, methodHeader);
    }
  }

  if (isFunction(defaults?.getHeaders)) {
    const _headers = defaults.getHeaders(method, partialURL);

    if (isObject(_headers)) {
      addToHeader(headers, _headers);
    }
  }

  // Set Basic Authorization Header
  if (auth || defaults?.auth) {
    const _auth = auth ?? defaults.auth;

    const { user, pass } = isFunction(_auth)
      ? (_auth as Function)(method, partialURL)
      : _auth;

    addToHeader(headers, {
      Authorization: "Basic " + btoa(`${user}:${pass}`)
    });
  }

  const body = (data => {
    if (isFormData(data) || isFile(data) || isBlob(data)) {
      return data;
    }

    if (isElement(data)) {
      return new FormData(data);
    }

    if (isURLSearchParams(data)) {
      setContentType(
        headers,
        "application/x-www-form-urlencoded;charset=utf-8"
      );
      return data.toString();
    }

    if (isObject(data)) {
      setContentType(headers, "application/json;charset=utf-8");
      return JSON.stringify(data);
    }

    return data;
  })(data);

  return {
    ...restConfig,
    method,
    headers,
    body
  };
}
