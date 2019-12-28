import { isObject } from "./utils";

interface Arguments {
  baseURL: string;
  partialURL: string;
  params: any;
}

export function getURL({ baseURL, partialURL, params }: Arguments) {
  const url = new URL(combineUrl(baseURL, partialURL));

  if (isObject(params)) {
    for (const [key, value] of Object.entries<any>(params)) {
      url.searchParams.append(key, value);
    }
  }

  return url.href;
}

function combineUrl(base: string, partial?: string) {
  return partial
    ? base.replace(/\/+$/, "") + "/" + partial.replace(/^\/+/, "")
    : base;
}
