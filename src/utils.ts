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

export function addToHeader(header: Headers, obj: any) {
  Object.entries(obj).forEach(([key, value]) => header.set(key, String(value)));
}

export function setContentType(header: Headers, value: string) {
  header.set("Content-Type", value);
}
