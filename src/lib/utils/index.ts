import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UAParser } from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generalizeUrls = (url?: string) => {
  if (!url || url === "") return null;
  if (url.endsWith("/")) url = url.slice(0, -1);
  return url;
};

export function getDeviceInfo() {
  if (typeof window === "undefined") {
    // Server-side, return default
    return {
      deviceName: "Unknown",
      deviceType: "Desktop",
      deviceOs: "Unknown",
    };
  }

  const parser = new UAParser();
  const result = parser.getResult();

  return {
    deviceName: result.device.model || "Unknown",
    deviceType: result.device.type || "Desktop",
    deviceOs: result.os.name || "Unknown",
  };
}

export function exactNetError(error: Error | AxiosError) {
  if (error instanceof AxiosError) {
    const data = error?.response?.data;
    if (!data) {
      return "Terjadi kesalahan jaringan";
    }
    if (data?.data?.details && Array.isArray(data?.data?.details)) {
      return data?.data?.details.map((detail: { message: string }) => detail.message).join(", ");
    }
    if (data?.data?.details?.message) {
      return data?.data?.details?.message;
    }
  }
  return error.message;
}

export const safePromise = async <T>(
  promise: () => Promise<T>,
  onFail?: (err: Error) => void,
  onFinally?: () => void,
) => {
  try {
    const data = await promise();
    return [data, undefined] as [T, undefined];
  } catch (error) {
    if (onFail) onFail(error as Error);
    return [undefined, error] as [undefined, Error];
  } finally {
    if (onFinally) onFinally();
  }
};
