import { RequestConfig, RequestInstance } from "./index";
import {
  isObject,
  appendToHeader,
  isFormData,
  isFile,
  isBlob,
  isElement,
  setContentType,
  isURLSearchParams
} from "./utils";

export function mergeConfig(
  defaults: RequestInstance,
  config: RequestConfig
): RequestInit {
  const headers = new Headers({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded"
  });

  if (isObject(defaults?.headers)) {
    const { common } = defaults.headers;

    if (isObject(common)) {
      appendToHeader(headers, common);
    }

    const methodHeader = defaults.headers[config.method.toLowerCase()];

    if (isObject(methodHeader)) {
      appendToHeader(headers, methodHeader);
    }
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
  })(config.data);

  return {
    headers,
    body
  };
}
