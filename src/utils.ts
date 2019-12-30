export function isFormData(data: any) {
  return data instanceof FormData;
}

export function isObject(data: any) {
  return data != null && typeof data === "object";
}

export function isFile(data: any) {
  return data instanceof File;
}

export function isBlob(data: any) {
  return data instanceof Blob;
}

export function isElement(data: any) {
  return isObject(data) && data.nodeType === 1;
}

export function isURLSearchParams(data: any) {
  return typeof data !== "undefined" && data instanceof URLSearchParams;
}

export function isFunction(fn: any) {
  return typeof fn === "function";
}

export function addToHeader(header: Headers, obj: any) {
  Object.entries(obj).forEach(([key, value]) => header.set(key, String(value)));
}

export function setContentType(header: Headers, value: string) {
  header.set("Content-Type", value);
}

export function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

export function timeout(
  promise: Promise<any>,
  ms: number,
  abortController: AbortController
) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (abortController) {
        abortController.abort();
      }

      reject(new TimeoutError());
    }, ms);

    promise
      .then(resolve)
      .catch(reject)
      .then(() => {
        clearTimeout(timeout);
      });
  });
}

class TimeoutError extends Error {
  constructor() {
    super("Request timed out");
    this.name = "TimeoutError";
  }
}
